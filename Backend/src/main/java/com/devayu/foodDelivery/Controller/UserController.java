package com.devayu.foodDelivery.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.devayu.foodDelivery.DTO.AuthResponse;
import com.devayu.foodDelivery.DTO.GoogleUsernameRequest;
import com.devayu.foodDelivery.DTO.LoginRequest;
import com.devayu.foodDelivery.DTO.UserResponse;
import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Model.UserPrincipal;
import com.devayu.foodDelivery.Service.JwtService;
import com.devayu.foodDelivery.Service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping("/users")
    public List<UserResponse> getUsers() {

        return service.getAllUsers()
                .stream()
                .map(user -> new UserResponse(
                        user.getUsername(),
                        user.getEmail(),
                        user.getDisplayName(),
                        user.getRole()
                ))
                .toList();
    }


    // =========================
    // NORMAL REGISTRATION
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            User savedUser = service.saveUser(user);

            UserResponse response = new UserResponse(
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getDisplayName(),
                    savedUser.getRole()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // =========================
    // GOOGLE REGISTRATION
    // =========================

    @PostMapping("/auth/google/register")
    public ResponseEntity<?> registerGoogleUser(
            @RequestBody GoogleUsernameRequest request,
            @AuthenticationPrincipal OAuth2User googleUser,
            HttpServletRequest httpRequest) {

        try {

            // Controller handles Spring Security / OAuth information
            if (googleUser == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "Google authentication required"
                        ));
            }

            String googleId = googleUser.getAttribute("sub");
            String email = googleUser.getAttribute("email");

            if (googleId == null || email == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Google information unavailable"
                        ));
            }

            // Business logic is handled by service
            AuthResponse response = service.registerGoogleUser(
                    email,
                    googleId,
                    request.getUsername()
            );

            // OAuth session is no longer needed
            var session = httpRequest.getSession(false);

            if (session != null) {
                session.invalidate();
            }

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // =========================
    // GOOGLE LOGIN STATUS
    // =========================

    @GetMapping("/auth/google/status")
    public ResponseEntity<?> googleStatus(
            Authentication authentication,
            HttpServletRequest httpRequest) {

        try {

            // Controller checks authenticated Google principal
            if (authentication == null
                    || !authentication.isAuthenticated()
                    || !(authentication.getPrincipal() instanceof OAuth2User)) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "Google authentication required"
                        ));
            }

            OAuth2User googleUser =
                    (OAuth2User) authentication.getPrincipal();

            String googleId = googleUser.getAttribute("sub");
            String email = googleUser.getAttribute("email");

            if (googleId == null || email == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message",
                                "Google information unavailable"
                        ));
            }

            // Business logic is handled by service
            Map<String, Object> response =
                    service.getGoogleLoginStatus(
                            googleId,
                            email
                    );

            // Existing Google user has now been converted to JWT auth
            Object registered = response.get("registered");

            if (Boolean.TRUE.equals(registered)) {

                var session = httpRequest.getSession(false);

                if (session != null) {
                    session.invalidate();
                }
            }

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Something went wrong"
                    ));
        }
    }


    // =========================
    // NORMAL LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getIdentifier(),
                                    request.getPassword()
                            )
                    );

            if (authentication.isAuthenticated()) {

                UserPrincipal principal =
                        (UserPrincipal) authentication.getPrincipal();

                String username =
                        principal.getUser().getUsername();

                String token =
                        jwtService.generateToken(username);

                String role = principal
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority()
                        .replace("ROLE_", "");

                return ResponseEntity.ok(
                        new AuthResponse(
                                token,
                                username,
                                role
                        )
                );
            }

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"
                    ));
        }
    }


    // =========================
    // CURRENT USER
    // =========================

    @GetMapping("/auth/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Not authenticated"
                    ));
        }

        if (!(authentication.getPrincipal()
                instanceof UserPrincipal principal)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "JWT authentication required"
                    ));
        }

        User user = principal.getUser();

        String role = authentication
                .getAuthorities()
                .stream()
                .findFirst()
                .map(authority ->
                        authority.getAuthority()
                                .replace("ROLE_", ""))
                .orElse("");

        return ResponseEntity.ok(
                new UserResponse(
                        user.getUsername(),
                        user.getEmail(),
                        user.getDisplayName(),
                        role
                )
        );
    }
}