package com.agora.pretetgo.specifications;

import jakarta.persistence.criteria.*;

import java.util.Collection;
import java.util.List;

public abstract class BaseSpecification {

    protected static <V> void addEqual(
            List<Predicate> predicates,
            CriteriaBuilder cb,
            Path<V> path,
            V value
    ) {
        if (value != null) {
            predicates.add(cb.equal(path, value));
        }
    }

    protected static void addLike(
            List<Predicate> predicates,
            CriteriaBuilder cb,
            Path<String> path,
            String value
    ) {
        if (value != null && !value.isBlank()) {
            predicates.add(
                    cb.like(cb.lower(path), "%" + value.toLowerCase() + "%")
            );
        }
    }

    protected static Predicate andAll(
            CriteriaBuilder cb,
            List<Predicate> predicates
    ) {
        return cb.and(predicates.toArray(new Predicate[0]));
    }

    protected static <V extends Comparable<? super V>> void addBetween(
            List<Predicate> predicates,
            CriteriaBuilder cb,
            Path<V> path,
            V from,
            V to
    ) {
        if (from != null) {
            predicates.add(cb.greaterThanOrEqualTo(path, from));
        }
        if (to != null) {
            predicates.add(cb.lessThanOrEqualTo(path, to));
        }
    }

    protected static <V> void addIn(
            List<Predicate> predicates,
            Path<V> path,
            Collection<V> values
    ) {
        if (values != null && !values.isEmpty()) {
            predicates.add(path.in(values));
        }
    }

    protected static <E, V> void addInJoin(
            List<Predicate> predicates,
            Root<E> root,
            String collectionName,
            String fieldName,
            Collection<V> values
    ) {
        if (values != null && !values.isEmpty()) {
            Join<E, ?> join = root.join(collectionName);
            predicates.add(join.get(fieldName).in(values));
        }
    }

}
