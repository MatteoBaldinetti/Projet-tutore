package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.FileMetaDataFilterDTO;
import com.agora.pretetgo.models.FileMetaData;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class FileMetaDataSpecification extends BaseSpecification {
    public static Specification<FileMetaData> withFilter(FileMetaDataFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("filename"), filter.filename());
            addLike(predicates, criteriaBuilder, root.get("url"), filter.url());
            addIn(predicates, root.get("resourcesImages").get("id"), filter.resourcesImageIds());
            addEqual(predicates, criteriaBuilder, root.get("uploadedAt"), filter.uploadedAt());
            addBetween(predicates, criteriaBuilder, root.get("uploadedAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}