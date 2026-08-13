package com.devayu.foodDelivery.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HomeController {
    
    @GetMapping("/")
    public static String hello(){
        return "Hello Springboot World";
    }
}
