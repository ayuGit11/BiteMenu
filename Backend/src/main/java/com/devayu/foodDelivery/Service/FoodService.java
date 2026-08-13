package com.devayu.foodDelivery.Service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Repository.FoodRepository;

@Service
public class FoodService {
    @Autowired
    private FoodRepository repo;

   //Get all food
    public List<Food> getAllFoods() {
        return repo.findAll();
    }

    //Get food by Id
    public Food getFoodById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    }
    
    //Add Food
    public Food addFood(Food food) {
        return repo.save(food);
    }

    // Update food
    public Food updateFood(Integer id, Food food) {

        Food existingFood = repo.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));

        existingFood.setFoodName(food.getFoodName());
        existingFood.setFoodImage(food.getFoodImage());
        existingFood.setPrice(food.getPrice());
        existingFood.setFoodType(food.getFoodType());
        existingFood.setFoodCategory(food.getFoodCategory());

        return repo.save(existingFood);
    }

    // Delete food
    public void deleteFood(Integer id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Food not found");
        }

        repo.deleteById(id);
    }

}
