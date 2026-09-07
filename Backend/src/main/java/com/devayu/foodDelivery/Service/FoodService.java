package com.devayu.foodDelivery.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Repository.FoodRepository;

@Service
public class FoodService {
    @Autowired
    private FoodRepository repo;

    private final String uploadDir = "uploads/images/";

    private String saveImage(MultipartFile image) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            // Create folder if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }
    private void deleteImage(String fileName) {

        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }
   //Get all food
    public List<Food> getAllFoods() {
        return repo.findAll();
    }

    //Get food by Id
    public Food getFoodById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    }
    
    //Add Food
    public Food addFood(String foodName,float price, String foodType, String foodCategory,String foodImage, MultipartFile image) {
         Food food = new Food();

        food.setFoodName(foodName);
        food.setPrice(price);
        food.setFoodType(foodType);
        food.setFoodCategory(foodCategory);

        if (image != null && !image.isEmpty()) {
            String fileName = saveImage(image);
            food.setFoodImage(fileName);
        }
        else if (foodImage != null && !foodImage.isEmpty()) {
            food.setFoodImage(foodImage);
        }
        return repo.save(food);
    }

    // Update food
    public Food updateFood( Integer id,String foodName,float price,String foodType,String foodCategory,String foodImage,MultipartFile image) {

        Food existingFood = repo.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));

        existingFood.setFoodName(foodName);
        existingFood.setPrice(price);
        existingFood.setFoodType(foodType);
        existingFood.setFoodCategory(foodCategory);
         if (image != null && !image.isEmpty()) {
            String fileName = saveImage(image);
            existingFood.setFoodImage(fileName);
        }
        else if (foodImage != null && !foodImage.isEmpty()) {
            existingFood.setFoodImage(foodImage);
        }
        return repo.save(existingFood);
    }
 
    // Delete food
    public void deleteFood(Integer id) {
     
        Food food = repo.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
       
        if (food.getFoodImage() != null && !food.getFoodImage().isEmpty()) {
            deleteImage(food.getFoodImage());
        }

        repo.deleteById(id);
    }

}
