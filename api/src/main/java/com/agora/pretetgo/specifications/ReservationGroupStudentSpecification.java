package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.ReservationGroupStudentFilterDTO;
import com.agora.pretetgo.models.ReservationGroupStudent;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ReservationGroupStudentSpecification extends BaseSpecification {
    public static Specification<ReservationGroupStudent> withFilter(ReservationGroupStudentFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addEqual(predicates, criteriaBuilder, root.get("reservationGroup").get("id"), filter.reservationGroupId());
            addEqual(predicates, criteriaBuilder, root.get("student").get("id"), filter.studentId());
            addEqual(predicates, criteriaBuilder, root.get("role"), filter.role());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}