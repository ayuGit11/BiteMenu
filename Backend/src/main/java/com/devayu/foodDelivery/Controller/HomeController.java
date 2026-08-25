package com.devayu.foodDelivery.Controller;

import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HomeController {
    
    @GetMapping("/")
    public static String hello(HttpServletRequest request){
        return "Hello Springboot World " + request.getSession().getId();
    }
}
