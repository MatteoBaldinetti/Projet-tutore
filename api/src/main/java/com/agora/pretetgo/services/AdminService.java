package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.AdminDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.AdminMapper;
import com.agora.pretetgo.models.Admin;
import com.agora.pretetgo.repositories.AdminRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    @Transactional
    public Admin createAdmin(AdminDTO dto) {
        Admin admin = adminMapper.toEntity(dto);
        return adminRepository.save(admin);
    }

    @Transactional
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin with ID " + id + " not found"));
    }

    @Transactional
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Transactional
    public Admin updateAdmin(Long id, AdminDTO dto) {
        Admin current = getAdminById(id);
        adminMapper.updateAdminFromDto(dto, current);
        return adminRepository.save(current);
    }

    @Transactional
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(getAdminById(id).getId());
    }

    @Transactional
    public Admin patchAdmin(Long id, AdminDTO dto) {
        Admin current = getAdminById(id);
        adminMapper.patchAdminFromDto(dto, current);
        return adminRepository.save(current);
    }
}
