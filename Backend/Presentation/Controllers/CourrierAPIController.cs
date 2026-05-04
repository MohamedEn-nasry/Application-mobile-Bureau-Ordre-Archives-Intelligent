using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using CourriersDTO;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourrierAPIController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<CourrierDTO>> GetAllCourriers()
        {
            try
            {
                var courriers = Courrier.GetAllCourriers();
                return Ok(courriers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving courriers", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public ActionResult<CourrierDTO> GetCourrierById(int id)
        {
            try
            {
                var courrier = Courrier.Find(id);
                if (courrier == null)
                {
                    return NotFound(new { message = "Courrier not found" });
                }
                return Ok(courrier.CDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving courrier", error = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult<CourrierDTO> CreateCourrier([FromBody] CourrierDTO courrierDto)
        {
            try
            {
                var courrier = new Courrier(courrierDto, Courrier.enMode.AddNew);
                if (courrier.Save())
                {
                    return CreatedAtAction(nameof(GetCourrierById), new { id = courrier.Id }, courrier.CDTO);
                }
                return BadRequest(new { message = "Failed to create courrier" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating courrier", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<CourrierDTO> UpdateCourrier(int id, [FromBody] CourrierDTO courrierDto)
        {
            try
            {
                var existingCourrier = Courrier.Find(id);
                if (existingCourrier == null)
                {
                    return NotFound(new { message = "Courrier not found" });
                }

                courrierDto.Id = id;
                var courrier = new Courrier(courrierDto, Courrier.enMode.Update);
                if (courrier.Save())
                {
                    return Ok(courrier.CDTO);
                }
                return BadRequest(new { message = "Failed to update courrier" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating courrier", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public ActionResult<bool> UpdateCourrierStatus(int id, [FromBody] string status)
        {
            try
            {
                var result = Courrier.UpdateStatut(id, status);
                if (result)
                {
                    return Ok(true);
                }
                return BadRequest(new { message = "Failed to update courrier status" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating courrier status", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public ActionResult<bool> DeleteCourrier(int id)
        {
            try
            {
                var result = Courrier.Delete(id);
                if (result)
                {
                    return Ok(true);
                }
                return BadRequest(new { message = "Failed to delete courrier" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting courrier", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<CourrierDTO>> GetCourriersByUser(int userId)
        {
            try
            {
                var courriers = Courrier.GetCourriersByAssigneA(userId);
                return Ok(courriers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving user courriers", error = ex.Message });
            }
        }
    }
}
