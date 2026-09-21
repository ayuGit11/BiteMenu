package com.devayu.foodDelivery.Config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.devayu.foodDelivery.Service.JwtService;
import com.devayu.foodDelivery.Service.MyUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtFilter extends OncePerRequestFilter {

    @Autowired 
    private JwtService jwtService;

    @Autowired 
    ApplicationContext context;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");
                String username = null;
                String token = null;

                if(authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                    try {
                        username = jwtService.extractedUsername(token);
                    } catch (Exception e) {
                        // Invalid JWT
                        filterChain.doFilter(request, response);
                        return;
                    }
                }

                if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                   UserDetails userDetails =  context.getBean(MyUserDetailsService.class).loadUserByUsername(username); // Implement this method in JwtService
                   try {
                    if(jwtService.validateToken(token, userDetails)) {
                          UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                          SecurityContextHolder.getContext().setAuthentication(authToken);
                   }
                    } catch (Exception e) {
                        // Invalid/expired token
                    }
           }
            filterChain.doFilter(request, response);
        
    }

}
