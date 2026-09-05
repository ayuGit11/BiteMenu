package com.devayu.foodDelivery.Service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.devayu.foodDelivery.Model.CartItem;
import com.devayu.foodDelivery.Model.CartItemResponse;
import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Repository.CartItemRepository;
import com.devayu.foodDelivery.Repository.FoodRepository;
import com.devayu.foodDelivery.Repository.UserRepo;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepo userRepository;
    private final FoodRepository foodRepository;

    public CartService(CartItemRepository cartItemRepository,UserRepo userRepository,FoodRepository foodRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }

    // Get currently logged-in user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET CART
    public List<CartItemResponse> getCart() {
        User user = getCurrentUser();
        return cartItemRepository.findByUser(user)
            .stream()
            .map(item -> new CartItemResponse(
                    item.getFood().getId(),          // IMPORTANT: Food ID
                    item.getFood().getFoodName(),
                    item.getFood().getFoodImage(),
                    item.getFood().getPrice(),
                    item.getFood().getFoodType(),
                    item.getQuantity()              // Cart quantity
            ))
            .toList();
    }

    // ADD FOOD TO CART
    public CartItem addToCart(Integer foodId) {
        User user = getCurrentUser();
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new RuntimeException("Food not found"));

        // Check whether this food is already in user's cart
        return cartItemRepository
                .findByUserAndFood(user, food).map(existingItem -> {
                    existingItem.setQuantity(
                            existingItem.getQuantity() + 1
                    );
                    return cartItemRepository.save(existingItem);
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setFood(food);
                    newItem.setQuantity(1);
                    return cartItemRepository.save(newItem);
                });
    }

    // INCREASE / DECREASE QUANTITY
    public CartItem updateQuantity(Integer foodId, int quantity) {
        User user = getCurrentUser();
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new RuntimeException("Food not found"));

        CartItem cartItem = cartItemRepository
                .findByUserAndFood(user, food)
                .orElseThrow(() -> new RuntimeException("Food not found in cart"));

        // If quantity becomes 0 or less, remove item
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    // REMOVE ONE FOOD FROM CART
    public void removeFromCart(Integer foodId) {
        User user = getCurrentUser();
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new RuntimeException("Food not found"));

        CartItem cartItem = cartItemRepository
                .findByUserAndFood(user, food)
                .orElseThrow(() ->
                        new RuntimeException("Food not found in cart"));

        cartItemRepository.delete(cartItem);
    }

    // CLEAR ENTIRE CART
    public void clearCart() {
        User user = getCurrentUser();
        cartItemRepository.deleteByUser(user);
    }
}