package com.devayu.foodDelivery.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "food_items")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String foodName;
    private String foodCategory;
    private String foodType;
    private Integer foodQuantity;
    private String foodImage;
    private float price;

    // getters and setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getFoodName() {
        return foodName;
    }
    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }
    public String getFoodCategory() {
        return foodCategory;
    }
    public void setFoodCategory(String foodCategory) {
        this.foodCategory = foodCategory;
    }
    public String getFoodType() {
        return foodType;
    }
    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }
    public Integer getFoodQuantity() {
        return foodQuantity;
    }
    public void setFoodQuantity(Integer foodQuantity) {
        this.foodQuantity = foodQuantity;
    }
    public String getFoodImage() {
        return foodImage;
    }
    public void setFoodImage(String fileName) {
        this.foodImage = fileName;
    }
    public float getPrice() {
        return price;
    }
    public void setPrice(float price) {
        this.price = price;
    }
    @Override
    public String toString() {
        return "Food [id=" + id + ", foodName=" + foodName + ", foodCategory=" + foodCategory + ", foodType=" + foodType
                + ", foodQuantity=" + foodQuantity + ", foodImage=" + foodImage + ", price=" + price + "]";
    }
}
