package com.agora.pretetgo.repositories;

import com.agora.pretetgo.models.ReservationGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationGroupRepository extends JpaRepository<ReservationGroup, Long>, JpaSpecificationExecutor<ReservationGroup> {
}
