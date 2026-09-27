package com.devayu.foodDelivery.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private String username;
    private String email;
    private String displayName;
    private String role;
}