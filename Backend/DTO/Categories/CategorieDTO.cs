using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.Categories
{
    public class CategorieDTO
    {
        public int Id { get; set; }

        public string Nom { get; set; } = string.Empty;

        public string? Description { get; set; }

        public CategorieDTO(int id, string nom, string? description)
        {
            Id = id;
            Nom = nom;
            Description = description;
        }
    }
}
