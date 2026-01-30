package com.agora.pretetgo.repositories;

import com.agora.pretetgo.models.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Long>, JpaSpecificationExecutor<ItemType> {
}
