package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.ItemTypeDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ItemTypeMapper;
import com.agora.pretetgo.models.ItemType;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ItemTypeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemTypeService {
    @Autowired
    private ItemTypeRepository itemTypeRepository;

    @Autowired
    private ItemTypeMapper itemTypeMapper;

    @Autowired
    private ProfessorService professorService;

    @Transactional
    public ItemType createItemType(ItemTypeDTO dto) {
        ItemType itemType = itemTypeMapper.toEntity(dto);
        setCreatedBy(dto, itemType);
        return itemTypeRepository.save(itemType);
    }

    @Transactional
    public ItemType getItemTypeById(Long id) {
        return itemTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ItemType with ID " + id + " not found"));
    }

    @Transactional
    public List<ItemType> getAllItemTypes() {
        return itemTypeRepository.findAll();
    }

    @Transactional
    public ItemType updateItemType(Long id, ItemTypeDTO dto) {
        ItemType current = getItemTypeById(id);
        itemTypeMapper.updateItemTypeFromDto(dto, current);
        setCreatedBy(dto, current);
        return itemTypeRepository.save(current);
    }

    @Transactional
    public void deleteItemType(Long id) {
        itemTypeRepository.deleteById(getItemTypeById(id).getId());
    }

    @Transactional
    public ItemType patchItemType(Long id, ItemTypeDTO dto) {
        ItemType current = getItemTypeById(id);
        itemTypeMapper.patchItemTypeFromDto(dto, current);
        setCreatedBy(dto, current);
        return itemTypeRepository.save(current);
    }

    private void setCreatedBy(ItemTypeDTO dto, ItemType current) {
        if (dto.createdById() != null) {
            Professor professor = professorService.getProfessorById(dto.createdById());
            current.setCreatedBy(professor);
        }
    }
}