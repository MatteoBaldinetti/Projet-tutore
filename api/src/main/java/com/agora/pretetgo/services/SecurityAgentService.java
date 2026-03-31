package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.SecurityAgentFilterDTO;
import com.agora.pretetgo.dto.insert.SecurityAgentInsertDTO;
import com.agora.pretetgo.dto.response.SecurityAgentResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.SecurityAgentMapper;
import com.agora.pretetgo.models.SecurityAgent;
import com.agora.pretetgo.repositories.SecurityAgentRepository;
import com.agora.pretetgo.specifications.SecurityAgentSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityAgentService {
    @Autowired
    private SecurityAgentRepository securityAgentRepository;

    @Autowired
    private SecurityAgentMapper securityAgentMapper;

    @Transactional
    public SecurityAgent createSecurityAgent(SecurityAgentInsertDTO dto) {
        SecurityAgent securityAgent = securityAgentMapper.toEntity(dto);
        return securityAgentRepository.save(securityAgent);
    }

    @Transactional
    public SecurityAgent getSecurityAgentById(Long id) {
        return securityAgentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SecurityAgent with ID " + id + " not found"));
    }

    @Transactional
    public List<SecurityAgent> getAllSecurityAgents() {
        return securityAgentRepository.findAll();
    }

    @Transactional
    public SecurityAgent updateSecurityAgent(Long id, SecurityAgentInsertDTO dto) {
        SecurityAgent current = getSecurityAgentById(id);
        securityAgentMapper.updateSecurityAgentFromDto(dto, current);
        return securityAgentRepository.save(current);
    }

    @Transactional
    public void deleteSecurityAgent(Long id) {
        securityAgentRepository.deleteById(getSecurityAgentById(id).getId());
    }

    @Transactional
    public SecurityAgent patchSecurityAgent(Long id, SecurityAgentInsertDTO dto) {
        SecurityAgent current = getSecurityAgentById(id);
        securityAgentMapper.patchSecurityAgentFromDto(dto, current);
        return securityAgentRepository.save(current);
    }

    @Transactional
    public List<SecurityAgentResponseDTO> searchSecurityAgents(SecurityAgentFilterDTO filterDTO) {
        return securityAgentRepository.findAll(
                        SecurityAgentSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(securityAgentMapper::toResponseDTO)
                .toList();
    }
}
