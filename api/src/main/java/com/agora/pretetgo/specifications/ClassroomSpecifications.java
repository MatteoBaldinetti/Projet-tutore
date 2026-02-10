package com.agora.pretetgo.specifications;

import com.agora.pretetgo.models.Classroom;
import org.springframework.data.jpa.domain.Specification;

public class ClassroomSpecifications {
    public static Specification<Classroom> hasId(Long id) {
        return (root, _, criteriaBuilder) ->
                id == null ? null : criteriaBuilder.equal(root.get("id"), id);
    }
}
