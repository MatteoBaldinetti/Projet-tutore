package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.StudentFilterDTO;
import com.agora.pretetgo.models.Student;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecification extends BaseSpecification {
    public static Specification<Student> withFilter(StudentFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("firstName"), filter.firstName());
            addLike(predicates, criteriaBuilder, root.get("lastName"), filter.lastName());
            addLike(predicates, criteriaBuilder, root.get("email"), filter.email());
            addLike(predicates, criteriaBuilder, root.get("password"), filter.password());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addEqual(predicates, criteriaBuilder, root.get("enabled"), filter.enabled());
            addEqual(predicates, criteriaBuilder, root.get("studentNumber"), filter.studentNumber());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}