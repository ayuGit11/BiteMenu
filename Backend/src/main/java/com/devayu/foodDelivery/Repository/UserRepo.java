package com.devayu.foodDelivery.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devayu.foodDelivery.Model.User;


public interface UserRepo extends JpaRepository<User, Integer> {
    // Define custom query methods if needed
    User findByUsername(String username);
    boolean existsByUsername(String username);
}
