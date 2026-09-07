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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authProvider() {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Default constructor
        http.csrf(customizer->customizer.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(request -> request
            // Public endpoints
            .requestMatchers(HttpMethod.GET, "/foods/**").permitAll()
            .requestMatchers("/register").permitAll()
            .requestMatchers("/images/**").permitAll()
            .requestMatchers("/login").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()


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
            .invalidateHttpSession(true)
            .clearAuthentication(true)
            .deleteCookies("JSESSIONID")
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));
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
