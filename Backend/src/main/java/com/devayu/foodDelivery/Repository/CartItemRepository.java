package com.devayu.foodDelivery.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devayu.foodDelivery.Model.CartItem;
import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Model.User;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndFood(User user, Food food);

    void deleteByUserAndFood(User user, Food food);

    void deleteByUser(User user);
}
