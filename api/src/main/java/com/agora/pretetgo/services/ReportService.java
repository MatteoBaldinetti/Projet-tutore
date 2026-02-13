package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ReportFilterDTO;
import com.agora.pretetgo.dto.insert.ReportInsertDTO;
import com.agora.pretetgo.dto.response.ReportResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ReportMapper;
import com.agora.pretetgo.models.Report;
import com.agora.pretetgo.repositories.ReportRepository;
import com.agora.pretetgo.specifications.ReportSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReportMapper reportMapper;

    @Transactional
    public Report createReport(ReportInsertDTO dto) {
        Report report = reportMapper.toEntity(dto);
        return reportRepository.save(report);
    }

    @Transactional
    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report with ID " + id + " not found"));
    }

    @Transactional
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional
    public Report updateReport(Long id, ReportInsertDTO dto) {
        Report current = getReportById(id);
        reportMapper.updateReportFromDto(dto, current);
        return reportRepository.save(current);
    }

    @Transactional
    public void deleteReport(Long id) {
        reportRepository.deleteById(getReportById(id).getId());
    }

    @Transactional
    public Report patchReport(Long id, ReportInsertDTO dto) {
        Report current = getReportById(id);
        reportMapper.patchReportFromDto(dto, current);
        return reportRepository.save(current);
    }

    @Transactional
    public List<ReportResponseDTO> searchReports(ReportFilterDTO filterDTO) {
        return reportRepository.findAll(
                        ReportSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(reportMapper::toResponseDTO)
                .toList();
    }
}