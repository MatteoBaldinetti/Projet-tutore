package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.FileMetaDataFilterDTO;
import com.agora.pretetgo.dto.insert.FileMetaDataInsertDTO;
import com.agora.pretetgo.dto.response.FileMetaDataResponseDTO;
import com.agora.pretetgo.exceptions.BadRequestException;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.FileMetaDataMapper;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.repositories.FileMetaDataRepository;
import com.agora.pretetgo.specifications.FileMetaDataSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;

@Service
public class FileMetaDataService {
    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    FileMetaDataMapper fileMetaDataMapper;

    private final Path uploadDir = Paths.get("uploads");

    @Transactional
    public FileMetaData uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        try {
            Files.createDirectories(uploadDir);

            String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            Path path = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            FileMetaData fileMetaData = new FileMetaData(
                    fileName,
                    "/api/fileMetaData/download/" + fileName,
                    Instant.now()
            );

            return fileMetaDataRepository.save(fileMetaData);
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<Resource> downloadFile(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            throw new BadRequestException("File name is empty");
        }

        try {
            Path path = uploadDir.resolve(fileName);

            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + fileName + "\""
                    )
                    .header(
                            HttpHeaders.CONTENT_TYPE,
                            "application/octet-stream"
                    )
                    .body(
                            resource
                    );

        } catch (MalformedURLException e) {
            throw new BadRequestException("Failed to download file: " + fileName + " " + e.getMessage());
        }
    }

    @Transactional
    public FileMetaData createFileMetaData(FileMetaDataInsertDTO dto) {
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
    public FileMetaData updateFileMetaData(Long id, FileMetaDataInsertDTO dto) {
        FileMetaData current = getFileMetaDataById(id);
        fileMetaDataMapper.updateFileMetaDataFromDto(dto, current);
        return fileMetaDataRepository.save(current);
    }

    @Transactional
    public void deleteFileMetaData(Long id) {
        fileMetaDataRepository.deleteById(getFileMetaDataById(id).getId());
    }

    @Transactional
    public FileMetaData patchFileMetaData(Long id, FileMetaDataInsertDTO dto) {
        FileMetaData current = getFileMetaDataById(id);
        fileMetaDataMapper.patchFileMetaDataFromDto(dto, current);
        return fileMetaDataRepository.save(current);
    }

    @Transactional
    public List<FileMetaDataResponseDTO> searchFileMetaData(FileMetaDataFilterDTO filterDTO) {
        return fileMetaDataRepository.findAll(
                        FileMetaDataSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(fileMetaDataMapper::toResponseDTO)
                .toList();
    }
}