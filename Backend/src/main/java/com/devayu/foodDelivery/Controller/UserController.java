package com.devayu.foodDelivery.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.devayu.foodDelivery.Model.LoginRequest;
import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping ("/users")
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PostMapping ("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
      try {
        User savedUser = service.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        return service.loginUser(request.getUsername(),request.getPassword(),httpRequest,httpResponse);
    }
}
