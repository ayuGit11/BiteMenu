package com.devayu.foodDelivery.Controller;

import java.util.List;

import org.antlr.v4.runtime.misc.IntegerList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Service.FoodService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/foods")
@CrossOrigin(origins = "http://localhost:5173") // React Vite
public class FoodController {
    @Autowired
    private FoodService service;

    @GetMapping
    public List<Food> getFoods() {
        return service.getAllFoods();
    }

    @GetMapping("/{id}")
    public Food getFoodById(@PathVariable Integer id) {
        return service.getFoodById(id);
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute(CsrfToken.class.getName());
    }

    @PostMapping
    public Food addFood(@RequestParam String foodName,@RequestParam Integer price,@RequestParam String foodType,
        @RequestParam String foodCategory,@RequestParam(required = false) String foodImage, @RequestParam(required = false) MultipartFile image) {
        return service.addFood(foodName, price, foodType, foodCategory,foodImage, image);
    }

    @PutMapping("/{id}")
    public Food updateFood( @PathVariable Integer id,@RequestParam String foodName,@RequestParam Integer price,@RequestParam String foodType,
        @RequestParam String foodCategory,@RequestParam(required = false) String foodImage,@RequestParam(required = false) MultipartFile image) {
        return service.updateFood(id, foodName, price, foodType, foodCategory, foodImage, image);
    }

    @DeleteMapping("/{id}")
    public String deleteFood(@PathVariable Integer id) {
        service.deleteFood(id);
        return "Food deleted successfully";
    }
}
