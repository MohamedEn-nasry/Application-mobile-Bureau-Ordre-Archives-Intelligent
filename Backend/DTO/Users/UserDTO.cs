using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;


namespace DTO.Users
    {

    public class UserDTO
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        //[JsonPropertyName("password")]
        public string? Password { get; set; }

        public string RoleName { get; set; }
        public bool IsActif { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? ImagePath { get; set; }
        public int? CategorieId { get; set; }

        public string? RefreshTokenHash { get; set; }
        public DateTime? RefreshTokenExpiresAt { get; set; }
        public DateTime? RefreshTokenRevokedAt { get; set; }

        public UserDTO(
                    int id,
                    string firstname,
                    string lastname,
                    string email,

                    string password,
                
                    string roleName,
                    bool isActif,
                    DateTime createdAt,
                    DateTime updatedAt,
                    string imagePath)
        {
            Id = id;
            Firstname = firstname;
            Lastname = lastname;
            Email = email;
            Password = password;

            RoleName = roleName;
            IsActif = isActif;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            ImagePath = imagePath;
        }
    }


    public class ChangePasswordDTO
    {
        public int Id { get; set; }
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }







}

