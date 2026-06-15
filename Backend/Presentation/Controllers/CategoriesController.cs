using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/Categories")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = Categorie.GetAllCategories();

            return Ok(categories);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var categorie = Categorie.Find(id);

            if (categorie == null)
                return NotFound(new { message = "Catégorie introuvable." });

            return Ok(categorie.CDTO);
        }
    }
}