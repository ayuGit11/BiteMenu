package com.devayu.foodDelivery.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.devayu.foodDelivery.Model.User;
import com.devayu.foodDelivery.Model.UserPrincipal;
import com.devayu.foodDelivery.Repository.UserRepo;

@Service
public class MyUserDetailsService implements UserDetailsService {
    // Implement the methods of UserDetailsService here
    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return new UserPrincipal(user);
    }
}
