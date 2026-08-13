package com.devayu.foodDelivery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.devayu.foodDelivery.Repository.FoodRepository;

@SpringBootApplication
public class FoodDeliveryApplication {
    FoodRepository repo;
	public static void main(String[] args) {
         SpringApplication.run(FoodDeliveryApplication.class, args);
	}

}
