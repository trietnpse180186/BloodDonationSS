package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.StaffCreationRequest;
import com.swpproject.BloodDonation.dto.request.StaffUpdateRequest;
import com.swpproject.BloodDonation.dto.response.DashboardStatsResponse;
import com.swpproject.BloodDonation.dto.response.StaffResponse;
import com.swpproject.BloodDonation.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
    
    @PostMapping("/staff")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StaffResponse> createStaff(@RequestBody StaffCreationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createStaff(request));
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<StaffResponse>> getAllStaff() {
        return ResponseEntity.ok(adminService.getAllStaff());
    }

    @GetMapping("/staff/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable("id") String staffId) {
        return ResponseEntity.ok(adminService.getStaffById(staffId));
    }

    @PutMapping("/staff/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable("id") String staffId,
            @RequestBody StaffUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateStaff(staffId, request));
    }

    @DeleteMapping("/staff/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteStaff(@PathVariable("id") String staffId) {
        adminService.deleteStaff(staffId);
        return ResponseEntity.noContent().build();
    }
}