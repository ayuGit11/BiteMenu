package com.devayu.foodDelivery.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devayu.foodDelivery.Model.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food,Integer> {
    
}
