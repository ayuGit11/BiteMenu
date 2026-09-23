package com.devayu.foodDelivery.Config;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Repository.UserRepo;
import com.devayu.foodDelivery.Service.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(
            UserRepo userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User googleUser =
                (OAuth2User) authentication.getPrincipal();

        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");

        System.out.println("Google attributes: " + googleUser.getAttributes());
        System.out.println("Google email: " + email);
        System.out.println("Google name: " + name);

        if (email == null || email.isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Google email not available"
            );
            return;
        }

        /*
         * Find existing BiteMenu user.
         */
        User user = userRepository
                .findByUsername(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    // Using Google email as username
                    newUser.setUsername(email);
                    newUser.setDisplayName(name);

                    // Google users do not have a local password.
                    // We store a random BCrypt value because
                    // your current User model contains password.
                    newUser.setPassword(
                            passwordEncoder.encode(
                                    UUID.randomUUID().toString()
                            )
                    );

                    // All new Google users are normal users.
                    newUser.setRole("USER");

                    return userRepository.save(newUser);
                });


        /*
         * Generate BiteMenu JWT.
         */
        String jwt = jwtService.generateToken(user.getUsername());

        /*
         * Store JWT in HttpOnly cookie.
         */
        ResponseCookie cookie = ResponseCookie
                .from("BITEMENU_TOKEN", jwt)
                .httpOnly(true)
                .secure(false)       // true in HTTPS production
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("Lax")
                .build();

        response.addHeader(
                "Set-Cookie",
                cookie.toString()
        );

        /*
         * OAuth2 login session is no longer needed.
         */
        request.getSession().invalidate();

        /*
         * Send user back to React.
         */
        getRedirectStrategy().sendRedirect(
                request,
                response,
                "http://localhost:5173/"
        );
    }
}