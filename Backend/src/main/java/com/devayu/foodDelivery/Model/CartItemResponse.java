package com.devayu.foodDelivery.Model;

import lombok.Data;

@Data
public class CartItemResponse {

    private Integer id;
    private String foodName;
    private String foodImage;
    private Integer price;
    private String foodType;
    private Integer foodQuantity;

     public CartItemResponse(Integer id, String foodName, String foodImage,
                            Integer price, String foodType, Integer foodQuantity) {
        this.id = id;
        this.foodName = foodName;
        this.foodImage = foodImage;
        this.price = price;
        this.foodType = foodType;
        this.foodQuantity = foodQuantity;
    }
}