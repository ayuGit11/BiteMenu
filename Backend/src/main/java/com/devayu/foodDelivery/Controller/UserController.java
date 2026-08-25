package com.devayu.foodDelivery.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Service.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("users")
    public List<User> getUsers() {
        return service.getAllUsers();
    }
    @PostMapping("register")
    public User register(@RequestBody User user) {
        // Implement user registration logic here
        return service.saveUser(user);
    }
}
