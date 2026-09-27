package com.devayu.foodDelivery.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devayu.foodDelivery.Model.User;


public interface UserRepo extends JpaRepository<User, Integer> {
    // Define custom query methods if needed
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByGoogleId(String googleId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByUsernameIgnoreCaseOrEmailIgnoreCase(String username, String email);
}
