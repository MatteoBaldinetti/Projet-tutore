package com.agora.pretetgo.services;

import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.repositories.ResourceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;

    @Transactional
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResourceResource with ID " + id + " not found"));
    }

    @Transactional
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Transactional
    public void deleteResource(Long id) {
        resourceRepository.deleteById(getResourceById(id).getId());
    }
}
