package com.devayu.foodDelivery.Config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailService;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;
   
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, OAuth2SuccessHandler oauth2SuccessHandler) throws Exception {
        // Default constructor
        http.csrf(customizer->customizer.disable())
            .cors(Customizer.withDefaults())
            .oauth2Login(oauth2 -> oauth2.successHandler(oauth2SuccessHandler))
            .authorizeHttpRequests(request -> request
            // Public endpoints
            .requestMatchers(HttpMethod.GET, "/foods/**").permitAll()
            .requestMatchers("/register").permitAll()
            .requestMatchers("/images/**").permitAll()
            .requestMatchers("/login").permitAll()
                        
            // OAuth2
            .requestMatchers("/oauth2/**").permitAll()
            .requestMatchers("/login/oauth2/**").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            
            // Google onboarding
            .requestMatchers("/auth/google/**").authenticated()

            // Admin only
            .requestMatchers(HttpMethod.POST, "/foods").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/foods/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/foods/**").hasRole("ADMIN")

            // Logged-in users
            .requestMatchers("/orders/**").authenticated()
            .requestMatchers("/cart/**").authenticated()

            // Everything else
            .anyRequest().authenticated()
        )
            // .httpBasic(Customizer.withDefaults())
            .logout(logout -> logout
            .logoutUrl("/logout")
            .clearAuthentication(true)
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods( List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // @Bean
    // public UserDetailsService userDetailsService() {
    //     UserDetails user= User.withDefaultPasswordEncoder().username("ayushi").password("ayushi@123").roles("USER").build();
    //     UserDetails admin= User.withDefaultPasswordEncoder().username("admin").password("admin123").roles("ADMIN").build();
    //     return new InMemoryUserDetailsManager(user, admin);
    // }
}
