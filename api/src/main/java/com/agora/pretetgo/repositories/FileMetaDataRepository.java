package com.agora.pretetgo.repositories;

import com.agora.pretetgo.models.FileMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FileMetaDataRepository extends JpaRepository<FileMetaData, Long>, JpaSpecificationExecutor<FileMetaData> {
}
