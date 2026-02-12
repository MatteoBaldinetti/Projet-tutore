package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.AdminFilterDTO;
import com.agora.pretetgo.models.Admin;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AdminSpecification extends BaseSpecification {
    public static Specification<Admin> withFilter(AdminFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("firstName"), filter.firstName());
            addLike(predicates, criteriaBuilder, root.get("lastName"), filter.lastName());
            addLike(predicates, criteriaBuilder, root.get("email"), filter.email());
            addLike(predicates, criteriaBuilder, root.get("password"), filter.password());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addEqual(predicates, criteriaBuilder, root.get("enabled"), filter.enabled());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}