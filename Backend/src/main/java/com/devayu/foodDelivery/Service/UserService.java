package com.devayu.foodDelivery.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Repository.UserRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.web.context.SecurityContextRepository;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityContextRepository securityContextRepository; 

    public User saveUser(User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
           throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public ResponseEntity<?> loginUser(String username,String password, HttpServletRequest request, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(username,password));

            // Create SecurityContext
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            // Store SecurityContext in session
            securityContextRepository.saveContext(context,request,response);
            Optional<User> userOptional = userRepo.findByUsername(username);

            if (userOptional.isEmpty()) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        
            User user = userOptional.get();
            
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole()
            ));

        } catch (BadCredentialsException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}