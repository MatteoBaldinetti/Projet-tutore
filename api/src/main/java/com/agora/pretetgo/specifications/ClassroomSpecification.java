package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.ClassroomFilterDTO;
import com.agora.pretetgo.models.Classroom;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ClassroomSpecification extends BaseSpecification {
    public static Specification<Classroom> withFilter(ClassroomFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("name"), filter.name());
            addLike(predicates, criteriaBuilder, root.get("description"), filter.description());
            addEqual(predicates, criteriaBuilder, root.get("managedBy").get("id"), filter.managedById());
            addEqual(predicates, criteriaBuilder, root.get("available"), filter.available());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addEqual(predicates, criteriaBuilder, root.get("roomNumber"), filter.roomNumber());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}