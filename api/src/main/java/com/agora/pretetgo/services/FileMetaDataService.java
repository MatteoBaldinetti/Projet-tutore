package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.FileMetaDataDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.FileMetaDataMapper;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.repositories.FileMetaDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileMetaDataService {
    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    FileMetaDataMapper fileMetaDataMapper;

    @Transactional
    public FileMetaData createFileMetaData(FileMetaDataDTO dto) {
        FileMetaData fileMetaData = fileMetaDataMapper.toEntity(dto);
        return fileMetaDataRepository.save(fileMetaData);
    }

    @Transactional
    public FileMetaData getFileMetaDataById(Long id) {
        return fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FileMetaData with ID " + id + " not found"));
    }

    @Transactional
    public List<FileMetaData> getAllFileMetaData() {
        return fileMetaDataRepository.findAll();
    }

    @Transactional
    public FileMetaData updateFileMetaData(Long id, FileMetaDataDTO dto) {
        FileMetaData current = getFileMetaDataById(id);
        fileMetaDataMapper.updateFileMetaDataFromDto(dto, current);
        return fileMetaDataRepository.save(current);
    }

    @Transactional
    public void deleteFileMetaData(Long id) {
        fileMetaDataRepository.deleteById(getFileMetaDataById(id).getId());
    }

    @Transactional
    public FileMetaData patchFileMetaData(Long id, FileMetaDataDTO dto) {
        FileMetaData current = getFileMetaDataById(id);
        fileMetaDataMapper.patchFileMetaDataFromDto(dto, current);
        return fileMetaDataRepository.save(current);
    }
}