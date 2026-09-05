package com.devayu.foodDelivery.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devayu.foodDelivery.Model.CartItem;
import com.devayu.foodDelivery.Model.CartItemResponse;
import com.devayu.foodDelivery.Service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET /cart
    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart() {
        return ResponseEntity.ok(
                cartService.getCart()
        );
    }

    // POST /cart/{foodId}
    @PostMapping("/{foodId}")
    public ResponseEntity<CartItem> addToCart(@PathVariable Integer foodId) {
        return ResponseEntity.ok(cartService.addToCart(foodId));
    }

    // PUT /cart/{foodId}
    @PutMapping("/{foodId}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Integer foodId,@RequestParam int quantity) {
        CartItem updatedItem =cartService.updateQuantity(foodId, quantity);
        return ResponseEntity.ok(updatedItem);
    }

    // DELETE /cart/{foodId}
    @DeleteMapping("/{foodId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Integer foodId) {
        cartService.removeFromCart(foodId);
        return ResponseEntity.noContent().build();
    }

    // DELETE /cart
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}