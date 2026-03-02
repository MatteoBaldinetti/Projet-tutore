package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.ReportFilterDTO;
import com.agora.pretetgo.models.Report;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ReportSpecification extends BaseSpecification {
    public static Specification<Report> withFilter(ReportFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addLike(predicates, criteriaBuilder, root.get("description"), filter.description());
            addEqual(predicates, criteriaBuilder, root.get("resource").get("id"), filter.resourceId());
            addEqual(predicates, criteriaBuilder, root.get("reportedBy").get("id"), filter.reportedById());
            addEqual(predicates, criteriaBuilder, root.get("status"), filter.status());
            addEqual(predicates, criteriaBuilder, root.get("image").get("id"), filter.imageId());
            addEqual(predicates, criteriaBuilder, root.get("createdAt"), filter.createdAt());
            addBetween(predicates, criteriaBuilder, root.get("createdAt"), filter.createdFrom(), filter.createdTo());

            return andAll(criteriaBuilder, predicates);
        };
    }
}