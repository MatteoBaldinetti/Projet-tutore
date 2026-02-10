package com.agora.pretetgo.services;

import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.models.User;
import com.agora.pretetgo.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Transactional
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserUser with ID " + id + " not found"));
    }

    @Transactional
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(getUserById(id).getId());
    }
}
