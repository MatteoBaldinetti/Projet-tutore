package com.agora.pretetgo.repositories;

import com.agora.pretetgo.models.ReservationGroupStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationGroupStudentRepository extends JpaRepository<ReservationGroupStudent, Long>, JpaSpecificationExecutor<ReservationGroupStudent> {
}
