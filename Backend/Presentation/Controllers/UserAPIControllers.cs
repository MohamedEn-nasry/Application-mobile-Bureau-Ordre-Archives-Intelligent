using BusinessLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UsersDTO;
using BL = BusinessLayer;
using DTO.Users;

namespace UserApi.Controllers
{
    [Authorize]
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet("All", Name = "GetAllUsers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<UserDTO>> GetAllUsers()
        {
            List<UserDTO> usersList = BL.User.GetAllUsers();

            if (usersList.Count == 0)
            {
                return NotFound("No Users found");
            }

            return Ok(usersList);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("Active", Name = "GetActiveUsers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<UserDTO>> GetActiveUsers()
        {
            List<UserDTO> activeUsers = BL.User.GetActiveUsers();

            if (activeUsers.Count == 0)
            {
                return NotFound("No Active Users found");
            }

            return Ok(activeUsers);
        }

        [HttpGet("ActiveCount", Name = "GetActiveUsersCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<int> GetActiveUsersCount()
        {
            int count = BL.User.GetActiveUsersCount();
            return Ok(count);
        }

        [HttpGet("{id}", Name = "GetUserById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<UserDTO>> GetUserById(int id, [FromServices] IAuthorizationService authorizationService)
        {
            if (id < 1)
            {
                return BadRequest($"Not acceptable ID {id}");
            }

            BL.User user = BL.User.Find(id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            //var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            //var userRole = User.FindFirstValue(ClaimTypes.Role);


            //int authenticatedUserId = int.Parse(userID);

            //bool isAdmin = userRole == "Admin";

            //if (!isAdmin && authenticatedUserId != id)
            //    return Forbid();

            var authResult = await authorizationService.AuthorizeAsync(User, id, "UserOwnerOrAdmin");

            if (!authResult.Succeeded)
            {
                return Forbid();
            }

            UserDTO uDTO = user.UDTO;

            return Ok(uDTO);
        }

        [Authorize]
        [HttpPost("chgPssw/{id}", Name = "ChangePassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<bool>> ChangePassword(int id,
            [FromBody] ChangePasswordDTO dto,
            [FromServices] IAuthorizationService authorizationService)
        {
            if (id < 1)
                return BadRequest($"Not acceptable ID {id}");

            BL.User user = BL.User.Find(id);

            if (user == null)
                return NotFound($"User with ID {id} not found.");

            var authResult = await authorizationService.AuthorizeAsync(
                User,
                id,
                "UserOwnerOrAdmin"
            );

            if (!authResult.Succeeded)
                return Forbid();

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.Password))
                return BadRequest("Old password is incorrect.");

            if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.Password))
                return BadRequest("New password cannot be the same as the old password.");

            user.SetPassword(dto.NewPassword);

            if (!user.Save())
                return BadRequest("User was not saved.");

            return Ok(true);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Create",Name = "AddUser")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<UserDTO> AddUser(UserDTO newUser)
        {
            if (newUser == null ||
                string.IsNullOrEmpty(newUser.Firstname) ||
                string.IsNullOrEmpty(newUser.Lastname) ||
                string.IsNullOrEmpty(newUser.Email) ||
                string.IsNullOrEmpty(newUser.Password) ||
                string.IsNullOrEmpty(newUser.RoleName))
            {
                return BadRequest("Invalid user data.");
            }

            BL.User user = new BL.User(newUser);

            user.SetPassword(newUser.Password); // هنا القيمة القادمة من password
            if (!user.Save())
                return BadRequest("User was not saved.");

            newUser.Id = user.ID;

            return CreatedAtRoute("GetUserById", new { id = newUser.Id }, newUser);
        }



        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}", Name = "DeleteUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult DeleteUser(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }

            if (!BL.User.Delete(id))
            {
                return NotFound($"User with ID {id} not found.");
            }

            return Ok($"User with ID {id} has been deleted.");
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("update/{id}", Name = "UpdateUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> UpdateUser(int id, UserDTO updatedUser)
        {
            if (id < 1 ||
                updatedUser == null ||
                string.IsNullOrEmpty(updatedUser.Firstname) ||
                string.IsNullOrEmpty(updatedUser.Lastname) ||
                string.IsNullOrEmpty(updatedUser.Email) ||

                string.IsNullOrEmpty(updatedUser.RoleName))
            {
                return BadRequest("Invalid user data.");
            }


            BL.User user = BL.User.Find(id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            user.ID = id;
            user.Firstname = updatedUser.Firstname;
            user.Lastname = updatedUser.Lastname;
            user.Email = updatedUser.Email;
           // user.SetPassword(updatedUser.Password);
            user.RoleName = updatedUser.RoleName;
            user.IsActif = updatedUser.IsActif;
            if (!string.IsNullOrWhiteSpace(updatedUser.ImagePath))
            {
                user.ImagePath = updatedUser.ImagePath;
            }

            if (user.Save())
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, "An error occurred while updating the user.");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("deactivate/{id}", Name = "desactivateUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> DesactivateUser(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }
            BL.User user = BL.User.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }
            user.IsActif = false;
            if (user.Save())
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, "An error occurred while desactivating the user.");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("activate/{id}", Name = "activateUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> ActivateUser(int id)
        {
            if (id < 1)
            {
                return BadRequest($"Not accepted ID {id}");
            }
            BL.User user = BL.User.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }
            user.IsActif = true;
            if (user.Save())
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, "An error occurred while desactivating the user.");
            }



        

        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/assign-category/{categorieId}", Name = "AssignLecteurCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> AssignLecteurCategory(int id, int categorieId)
        {
            if (id < 1 || categorieId < 1)
            {
                return BadRequest("Invalid ID or Category ID");
            }

            BL.User user = BL.User.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            if (user.RoleName != "Lecteur" && user.RoleName != "SuperAgent")
            {
                return BadRequest("Category assignment is only applicable to Lecteur or SuperAgent role.");
            }

            if (BL.User.AssignLecteurOrSuperAgentCategory(id, categorieId))
            {
                return Ok(true);
            }

            return StatusCode(500, "An error occurred while assigning the category.");
        }

        [HttpGet("search-by-email")]
        [Authorize(Roles = "Admin,Agent,SuperAgent")]
        public IActionResult SearchByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email) || email.Trim().Length < 2)
                return Ok(new List<object>());

            var users = BL.User.SearchUsersByEmail(email.Trim());

            return Ok(users);
        }

    }
}