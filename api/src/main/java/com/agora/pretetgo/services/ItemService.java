package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ItemFilterDTO;
import com.agora.pretetgo.dto.insert.ItemInsertDTO;
import com.agora.pretetgo.dto.response.ItemResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ItemMapper;
import com.agora.pretetgo.models.*;
import com.agora.pretetgo.repositories.FileMetaDataRepository;
import com.agora.pretetgo.repositories.ItemRepository;
import com.agora.pretetgo.repositories.ProfessorRepository;
import com.agora.pretetgo.repositories.TagRepository;
import com.agora.pretetgo.specifications.ItemSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private FileMetaDataService fileMetaDataService;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ItemTypeService itemTypeService;

    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public Item createItem(ItemInsertDTO dto) {
        Item item = itemMapper.toEntity(dto);
        mapDTOIds(dto, item);
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
        mapDTOIds(dto, current);
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
        mapDTOIds(dto, current);
        return itemRepository.save(current);
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

    public void mapDTOIds(ItemInsertDTO dto, Item current) {
        fetchManagedBy(dto.managedByIds(), current);
        fetchFileMetaData(dto.imageIds(), current);
        setModel3d(dto, current);
        fetchTag(dto.tagIds(), current);
        setTypeId(dto, current);
        setUsagePdf(dto, current);
    }

    private void setModel3d(ItemInsertDTO dto, Item current) {
        if (dto.model3dId() != null) {
            FileMetaData fileMetaData = fileMetaDataService.getFileMetaDataById(dto.model3dId());
            current.setModel3d(fileMetaData);
        }
    }

    private void setUsagePdf(ItemInsertDTO dto, Item current) {
        if (dto.usagePdfId() != null) {
            FileMetaData fileMetaData = fileMetaDataService.getFileMetaDataById(dto.usagePdfId());
            current.setUsagePdf(fileMetaData);
        }
    }

    private void setTypeId(ItemInsertDTO dto, Item current) {
        if (dto.itemTypeId() != null) {
            ItemType itemType = itemTypeService.getItemTypeById(dto.itemTypeId());
            current.setItemType(itemType);
        }
    }

    private void fetchManagedBy(Set<Long> professorIds, Item item) {
        if (professorIds == null) return;

        Set<Professor> professors = professorIds.stream()
                .map(id -> professorRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Professor with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        item.setManagedBy(professors);

        for (Professor professor : professors) {
            professor.getResources().add(item);
        }
    }

    private void fetchFileMetaData(Set<Long> fileMetaDataId, Item item) {
        if (fileMetaDataId == null) return;

        Set<FileMetaData> fileMetaData = fileMetaDataId.stream()
                .map(id -> fileMetaDataRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("FileMetaData with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        item.setImages(fileMetaData);

        for (FileMetaData fileMetaData1 : fileMetaData) {
            fileMetaData1.getResourcesImages().add(item);
        }
    }

    private void fetchTag(Set<Long> tagId, Item item) {
        if (tagId == null) return;

        Set<Tag> tags = tagId.stream()
                .map(id -> tagRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Tag with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        item.setTags(tags);

        for (Tag tag :  tags) {
            tag.getResources().add(item);
        }
    }
}