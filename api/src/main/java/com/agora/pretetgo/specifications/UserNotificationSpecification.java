package com.agora.pretetgo.specifications;

import com.agora.pretetgo.dto.filter.UserNotificationFilterDTO;
import com.agora.pretetgo.models.UserNotification;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserNotificationSpecification extends BaseSpecification {
    public static Specification<UserNotification> withFilter(UserNotificationFilterDTO filter) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            addEqual(predicates, criteriaBuilder, root.get("id"), filter.id());
            addEqual(predicates, criteriaBuilder, root.get("notification").get("id"), filter.notificationId());
            addEqual(predicates, criteriaBuilder, root.get("user").get("id"), filter.userId());
            addEqual(predicates, criteriaBuilder, root.get("readAt"), filter.readAt());
            addEqual(predicates, criteriaBuilder, root.get("isRead"), filter.isRead());

            return andAll(criteriaBuilder, predicates);
        };
    }
}