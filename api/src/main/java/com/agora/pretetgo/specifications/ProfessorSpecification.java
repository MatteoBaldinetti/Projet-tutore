package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.ProfessorFilterDTO;
import com.agora.pretetgo.models.Professor;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProfessorSpecification extends BaseSpecification {
    public static Specification<Professor> withFilter(ProfessorFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("firstName"), filter.firstName());
            addLike(predicates, criteriaBuilder, root.get("lastName"), filter.lastName());
            addLike(predicates, criteriaBuilder, root.get("email"), filter.email());
            addLike(predicates, criteriaBuilder, root.get("password"), filter.password());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addEqual(predicates, criteriaBuilder, root.get("enabled"), filter.enabled());
            addInJoin(predicates, root, "subjects", "id", filter.subjectIds());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}