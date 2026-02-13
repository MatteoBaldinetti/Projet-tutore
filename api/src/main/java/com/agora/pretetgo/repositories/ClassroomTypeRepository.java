package com.agora.pretetgo.repositories;

import com.agora.pretetgo.models.ClassroomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassroomTypeRepository extends JpaRepository<ClassroomType, Long>, JpaSpecificationExecutor<ClassroomType> {
}
