package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.BloodUsageRequestDTO;
import com.swpproject.BloodDonation.dto.response.BloodInventoryDetailDTO;
import com.swpproject.BloodDonation.dto.response.BloodInventorySummaryDTO;
import com.swpproject.BloodDonation.entity.BloodInventory;
import com.swpproject.BloodDonation.entity.BloodInventoryBatch;
import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.repository.BloodInventoryBatchRepository;
import com.swpproject.BloodDonation.repository.BloodInventoryRepository;
import com.swpproject.BloodDonation.service.BloodInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-inventory")
@RequiredArgsConstructor
public class BloodInventoryController {

    private final BloodInventoryService bloodInventoryService;
    private final BloodInventoryRepository inventoryRepository;
    private final BloodInventoryBatchRepository batchRepository;

    /**
     * Lấy tóm tắt tồn kho máu
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<List<BloodInventorySummaryDTO>> getInventorySummary() {
        List<BloodInventorySummaryDTO> summary = bloodInventoryService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Lấy chi tiết tồn kho máu
     */
    @GetMapping("/details")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<List<BloodInventoryDetailDTO>> getInventoryDetails(
            @RequestParam(required = false) BloodType bloodType) {
        List<BloodInventoryDetailDTO> details = bloodInventoryService.getInventoryDetails(bloodType);
        return ResponseEntity.ok(details);
    }

    /**
     * Thêm máu vào kho từ việc hiến máu
     */
    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<BloodInventoryDetailDTO> addBloodFromDonation(
            @RequestParam String donorId,
            @RequestParam String donationId,
            @RequestParam(defaultValue = "Regular Donation") String source,
            Authentication authentication) {

        String updatedBy = authentication.getName();
        BloodInventoryDetailDTO added = bloodInventoryService.addBloodToDonation(donorId, donationId, source, updatedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(added);
    }

    /**
     * Sử dụng máu từ kho
     */
    @PostMapping("/use")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<?> useBlood(
            @RequestBody BloodUsageRequestDTO request,
            Authentication authentication) {

        String updatedBy = authentication.getName();
        boolean success = bloodInventoryService.useBlood(request, updatedBy);

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Insufficient required blood quantity");
        }
    }

    /**
     * Đánh dấu máu hết hạn
     */
    @PostMapping("/mark-expired")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<Void> markExpiredBlood(Authentication authentication) {
        String updatedBy = authentication.getName();
        bloodInventoryService.markExpiredBlood(updatedBy);
        return ResponseEntity.ok().build();
    }

    /**
     * Kiểm tra tồn kho của một nhóm máu
     */
    @GetMapping("/check/{bloodType}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN', 'USER')")
    public ResponseEntity<Double> checkInventoryByBloodType(
            @PathVariable BloodType bloodType) {
        Double availableQuantity = bloodInventoryService.getAvailableQuantityByBloodType(bloodType);
        return ResponseEntity.ok(availableQuantity != null ? availableQuantity : 0.0);
    }

    /**
     * Cập nhật thông tin đơn vị máu
     */
    @PutMapping("/{inventoryId}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<BloodInventoryDetailDTO> updateBloodInventory(
            @PathVariable String inventoryId,
            @RequestParam(required = false) Double quantity,
            @RequestParam(required = false) LocalDateTime expiryDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String notes,
            Authentication authentication) {

        String updatedBy = authentication.getName();
        BloodInventoryDetailDTO updated = bloodInventoryService.updateBloodInventory(
                inventoryId, quantity, expiryDate, status, notes, updatedBy);

        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa đơn vị máu
     */
    @DeleteMapping("/{inventoryId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBloodInventory(
            @PathVariable String inventoryId,
            Authentication authentication) {

        String deletedBy = authentication.getName();
        bloodInventoryService.deleteBloodInventory(inventoryId, deletedBy);

        return ResponseEntity.noContent().build();
    }

    /**
     * Cập nhật lô máu
     */
    @PutMapping("/batch/{batchId}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<Void> updateBloodBatch(
            @PathVariable String batchId,
            @RequestParam(required = false) Double totalQuantity,
            @RequestParam(required = false) Double remainingQuantity,
            @RequestParam(required = false) LocalDateTime expiryDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String notes,
            Authentication authentication) {

        String updatedBy = authentication.getName();
        bloodInventoryService.updateBloodBatch(
                batchId, totalQuantity, remainingQuantity, expiryDate, status, notes, updatedBy);

        return ResponseEntity.ok().build();
    }

    /**
     * Xóa lô máu
     */
    @DeleteMapping("/batch/{batchId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBloodBatch(
            @PathVariable String batchId,
            Authentication authentication) {

        String deletedBy = authentication.getName();
        bloodInventoryService.deleteBloodBatch(batchId, deletedBy);

        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thông tin chi tiết một đơn vị máu
     */
    @GetMapping("/{inventoryId}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<BloodInventoryDetailDTO> getBloodInventoryById(
            @PathVariable String inventoryId) {

        BloodInventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Blood unit not found"));

        return ResponseEntity.ok(bloodInventoryService.mapToDetailDTO(inventory));
    }

    /**
     * Lấy thông tin chi tiết một lô máu
     */
    @GetMapping("/batch/{batchId}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<BloodInventoryBatch> getBatchById(
            @PathVariable String batchId) {

        BloodInventoryBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Blood batch not found"));

        return ResponseEntity.ok(batch);
    }

    // Thêm endpoint này vào BloodInventoryController hiện có

    /**
     * Lấy lịch sử sử dụng máu
     */
    @GetMapping("/usage-history")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<List<BloodInventoryDetailDTO>> getBloodUsageHistory(
            @RequestParam(required = false) BloodType bloodType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // Nếu không có ngày bắt đầu, mặc định lấy 30 ngày gần nhất
        if (startDate == null) {
            startDate = LocalDateTime.now().minusDays(30);
        }

        // Nếu không có ngày kết thúc, mặc định là hiện tại
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        List<BloodInventoryDetailDTO> usageHistory = bloodInventoryService.getBloodUsageHistory(bloodType, startDate, endDate);
        return ResponseEntity.ok(usageHistory);
    }

    /**
     * Lấy thống kê sử dụng máu
     */
    @GetMapping("/usage-statistics")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getBloodUsageStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // Nếu không có ngày bắt đầu, mặc định lấy 30 ngày gần nhất
        if (startDate == null) {
            startDate = LocalDateTime.now().minusDays(30);
        }

        // Nếu không có ngày kết thúc, mặc định là hiện tại
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        Map<String, Object> statistics = bloodInventoryService.getBloodUsageStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Xuất báo cáo sử dụng máu dạng PDF
     */
    @GetMapping("/usage-report/pdf")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<FileSystemResource> exportUsageReportPdf(
            @RequestParam(required = false) BloodType bloodType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        if (startDate == null) {
            startDate = LocalDateTime.now().minusDays(30);
        }

        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        // Tạo báo cáo PDF từ dữ liệu lịch sử sử dụng máu
        FileSystemResource pdfResource = bloodInventoryService.generateUsagePdfReport(bloodType, startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=blood-usage-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfResource);
    }

    /**
     * Xuất báo cáo sử dụng máu dạng Excel
     */
    @GetMapping("/usage-report/excel")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public ResponseEntity<FileSystemResource> exportUsageReportExcel(
            @RequestParam(required = false) BloodType bloodType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        if (startDate == null) {
            startDate = LocalDateTime.now().minusDays(30);
        }

        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        // Tạo báo cáo Excel từ dữ liệu lịch sử sử dụng máu
        FileSystemResource excelResource = bloodInventoryService.generateUsageExcelReport(bloodType, startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=blood-usage-report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(excelResource);
    }
}