package com.devayu.foodDelivery.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Service.FoodService;

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

    @PostMapping
    public Food addFood(@RequestBody Food food) {
        return service.addFood(food);
    }

    @PutMapping("/{id}")
    public Food updateFood(@PathVariable Integer id, @RequestBody Food food) {
        return service.updateFood(id, food);
    }

    @DeleteMapping("/{id}")
    public String deleteFood(@PathVariable Integer id) {
        service.deleteFood(id);
        return "Food deleted successfully";
    }
}
