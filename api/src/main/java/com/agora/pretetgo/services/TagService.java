package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.TagFilterDTO;
import com.agora.pretetgo.dto.insert.TagInsertDTO;
import com.agora.pretetgo.dto.response.TagResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.TagMapper;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.models.Tag;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ResourceRepository;
import com.agora.pretetgo.repositories.TagRepository;
import com.agora.pretetgo.specifications.TagSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private ResourceRepository resourceRepository;

    @Transactional
    public Tag createTag(TagInsertDTO dto) {
        Tag tag = tagMapper.toEntity(dto);
        mapDTOIds(dto, tag);
        return tagRepository.save(tag);
    }

    @Transactional
    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag with ID " + id + " not found"));
    }

    @Transactional
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Transactional
    public Tag updateTag(Long id, TagInsertDTO dto) {
        Tag current = getTagById(id);
        tagMapper.updateTagFromDto(dto, current);
        mapDTOIds(dto, current);
        return tagRepository.save(current);
    }

    @Transactional
    public void deleteTag(Long id) {
        tagRepository.deleteById(getTagById(id).getId());
    }

    @Transactional
    public Tag patchTag(Long id, TagInsertDTO dto) {
        Tag current = getTagById(id);
        tagMapper.patchTagFromDto(dto, current);
        mapDTOIds(dto, current);
        return tagRepository.save(current);
    }

    @Transactional
    public List<TagResponseDTO> searchTags(TagFilterDTO filterDTO) {
        return tagRepository.findAll(
                        TagSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(tagMapper::toResponseDTO)
                .toList();
    }

    private void mapDTOIds(TagInsertDTO dto, Tag current) {
        setCreatedBy(dto, current);
        fetchResources(dto.resourceIds(), current);
    }

    private void setCreatedBy(TagInsertDTO dto, Tag current) {
        if (dto.createdById() != null) {
            Professor professor = professorService.getProfessorById(dto.createdById());
            current.setCreatedBy(professor);
        }
    }

    private void fetchResources(Set<Long> resourceIds, Tag tag) {
        if (resourceIds == null) return;

        Set<Resource> resources = resourceIds.stream()
                .map(id -> resourceRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Resource with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        tag.setResources(resources);

        for (Resource resource : resources) {
            resource.getTags().add(tag);
        }
    }
}