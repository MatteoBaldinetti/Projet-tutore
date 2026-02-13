package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ItemFilterDTO;
import com.agora.pretetgo.dto.insert.ItemInsertDTO;
import com.agora.pretetgo.dto.response.ItemResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ItemMapper;
import com.agora.pretetgo.models.Item;
import com.agora.pretetgo.models.ItemType;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ItemRepository;
import com.agora.pretetgo.specifications.ItemSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private ItemTypeService itemTypeService;

    @Transactional
    public Item createItem(ItemInsertDTO dto) {
        Item item = itemMapper.toEntity(dto);
        setManagedBy(dto, item);
        setTypeId(dto, item);
        return itemRepository.save(item);
    }

    @Transactional
    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item with ID " + id + " not found"));
    }

    @Transactional
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @Transactional
    public Item updateItem(Long id, ItemInsertDTO dto) {
        Item current = getItemById(id);
        itemMapper.updateItemFromDto(dto, current);
        setManagedBy(dto, current);
        setTypeId(dto, current);
        return itemRepository.save(current);
    }

    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(getItemById(id).getId());
    }

    @Transactional
    public Item patchItem(Long id, ItemInsertDTO dto) {
        Item current = getItemById(id);
        itemMapper.patchItemFromDto(dto, current);
        setManagedBy(dto, current);
        setTypeId(dto, current);
        return itemRepository.save(current);
    }

    private void setManagedBy(ItemInsertDTO dto, Item current) {
        if (dto.managedById() != null) {
            Professor professor = professorService.getProfessorById(dto.managedById());
            current.setManagedBy(professor);
        }
    }

    private void setTypeId(ItemInsertDTO dto, Item current) {
        if (dto.itemTypeId() != null) {
            ItemType itemType = itemTypeService.getItemTypeById(dto.itemTypeId());
            current.setItemType(itemType);
        }
    }

    @Transactional
    public List<ItemResponseDTO> searchItems(ItemFilterDTO filterDTO) {
        return itemRepository.findAll(
                        ItemSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(itemMapper::toResponseDTO)
                .toList();
    }
}