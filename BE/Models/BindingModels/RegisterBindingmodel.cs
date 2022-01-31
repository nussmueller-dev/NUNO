﻿using System.ComponentModel.DataAnnotations;

namespace NUNO_Backend.Models.BindingModels {
  public class RegisterBindingmodel {
    [Required]
    public string Email { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
  }
}