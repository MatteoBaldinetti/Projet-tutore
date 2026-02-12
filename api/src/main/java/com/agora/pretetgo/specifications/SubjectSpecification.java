package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.SubjectFilterDTO;
import com.agora.pretetgo.models.Subject;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SubjectSpecification extends BaseSpecification {
    public static Specification<Subject> withFilter(SubjectFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("name"), filter.name());
            addLike(predicates, criteriaBuilder, root.get("description"), filter.description());
            addInJoin(predicates, root, "professors", "id", filter.professorIds());

            return andAll(criteriaBuilder, predicates);
        };
    }
}