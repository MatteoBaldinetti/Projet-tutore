package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ResourceFilterDTO;
import com.agora.pretetgo.dto.response.ResourceResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ResourceMapper;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.repositories.ResourceRepository;
import com.agora.pretetgo.specifications.ResourceSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private ResourceMapper resourceMapper;

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

    @Transactional
    public List<ResourceResponseDTO> searchResources(ResourceFilterDTO filterDTO) {
        return resourceRepository.findAll(
                        ResourceSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(resourceMapper::toResponseDTO)
                .toList();
    }
}
