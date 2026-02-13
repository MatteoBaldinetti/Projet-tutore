package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.ReservationFilterDTO;
import com.agora.pretetgo.models.Reservation;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ReservationSpecification extends BaseSpecification {
    public static Specification<Reservation> withFilter(ReservationFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addEqual(predicates, criteriaBuilder, root.get("startDate"), filter.startDate());
            addEqual(predicates, criteriaBuilder, root.get("endDate"), filter.endDate());
            addEqual(predicates, criteriaBuilder, root.get("reservedBy").get("id"), filter.reservedById());
            addEqual(predicates, criteriaBuilder, root.get("resource").get("id"), filter.resourceId());
            addEqual(predicates, criteriaBuilder, root.get("status"), filter.status());
            addEqual(predicates, criteriaBuilder, root.get("validationDate"), filter.validationDate());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}