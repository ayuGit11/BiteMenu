package com.devayu.foodDelivery.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devayu.foodDelivery.DTO.AuthResponse;
import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Repository.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String validateAndNormalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Username cannot be empty");
        }
        username = username.trim().toLowerCase();
        if (!username.matches("^[a-zA-Z0-9_]{3,20}$")) {
            throw new RuntimeException(
                    "Username must be 3-20 characters and contain only letters, numbers, or underscore."
            );
        }
       return username;
   }
   private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password cannot be empty");
        }
        if (!password.matches(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$")) {
            throw new RuntimeException(
                    "Password must be 8-64 characters and include "
                    + "uppercase, lowercase, number, and special character."
            );
        }
    }    

    // =========================
    // NORMAL REGISTRATION
    // =========================

    public User saveUser(User user) {
        String username = validateAndNormalizeUsername(user.getUsername());
        String email = user.getEmail().trim().toLowerCase();
        // Validate password before encoding
        validatePassword(user.getPassword()); 
        // Duplicate username
        if (userRepo.existsByUsername(username)) {
            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Duplicate email
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException(
                    "Email already exists"
            );
        }

        user.setUsername(username);
        user.setEmail(email);

        // Encode password
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        // Display username initially
        user.setDisplayName(username);

        // Normal users
        user.setRole("USER");

        return userRepo.save(user);
    }


    // =========================
    // GOOGLE REGISTRATION
    // =========================

    public AuthResponse registerGoogleUser(
            String email,
            String googleId,
            String username) {

        if (email == null || googleId == null) {

            throw new RuntimeException(
                    "Google information unavailable"
            );
        }

        email = email.trim().toLowerCase();
        googleId = googleId.trim();
        username = validateAndNormalizeUsername(username);


        // Username must be unique
        if (userRepo.existsByUsername(username)) {

            throw new RuntimeException(
                    "This username already exists. Please choose something else."
            );
        }


        // Email must be unique
        if (userRepo.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        // Google account must be unique
        if (userRepo.existsByGoogleId(googleId)) {

            throw new RuntimeException(
                    "Google account already registered"
            );
        }


        // Create Google user
        User user = new User();

        user.setEmail(email);
        user.setGoogleId(googleId);
        user.setUsername(username);
        user.setDisplayName(username);
        user.setRole("USER");

        // Password intentionally remains null
        // because Google authentication is used

        User savedUser = userRepo.save(user);


        // Generate BiteMenu JWT
        String token =
                jwtService.generateToken(
                        savedUser.getUsername()
                );


        return new AuthResponse(
                token,
                savedUser.getUsername(),
                savedUser.getRole()
        );
    }


    // =========================
    // GOOGLE LOGIN STATUS
    // =========================

    public Map<String, Object> getGoogleLoginStatus(
            String googleId,
            String email) {

        email = email.trim().toLowerCase();
        googleId = googleId.trim();


        // Check whether this Google account
        // is already registered in BiteMenu
        Optional<User> existingUser =
                userRepo.findByGoogleId(googleId);


        // Existing Google user
        if (existingUser.isPresent()) {

            User user = existingUser.get();

            String token =
                    jwtService.generateToken(
                            user.getUsername()
                    );

            return Map.of(
                    "registered", true,
                    "token", token,
                    "username", user.getUsername(),
                    "role", user.getRole()
            );
        }


        // Google account is new,
        // but email already belongs to
        // another BiteMenu account
        if (userRepo.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "This email is already registered. "
                    + "Please use your existing login."
            );
        }


        // New Google user
        return Map.of(
                "registered", false,
                "email", email
        );
    }


    // =========================
    // FIND GOOGLE USER
    // =========================

    public Optional<User> findByGoogleId(
            String googleId) {

        return userRepo.findByGoogleId(googleId);
    }


    // =========================
    // FIND USER BY EMAIL
    // =========================

    public Optional<User> findByEmail(
            String email) {

        return userRepo.findByEmail(email);
    }


    // =========================
    // GET ALL USERS
    // =========================

    public List<User> getAllUsers() {

        return userRepo.findAll();
    }
}