package com.devayu.foodDelivery.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.devayu.foodDelivery.Model.Food;
import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Repository.UserRepo;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User saveUser(User user) {
        // Implement user saving logic here
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user);
    }
     public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
