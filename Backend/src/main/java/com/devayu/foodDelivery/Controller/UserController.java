package com.devayu.foodDelivery.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Service.JwtService;
import com.devayu.foodDelivery.Service.UserService;

import com.devayu.foodDelivery.Model.UserPrincipal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@RestController
public class UserController {
    @Autowired
    private UserService service;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired 
    private JwtService jwtService;

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
    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
    //     return service.loginUser(request.getUsername(),request.getPassword(),httpRequest,httpResponse);
    // }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            if(authentication.isAuthenticated()) {
                String token = jwtService.generateToken(user.getUsername());
                UserPrincipal principal =(UserPrincipal) authentication.getPrincipal();
                String role = principal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getUsername(),
                    "role", role
                ));
            } 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}
