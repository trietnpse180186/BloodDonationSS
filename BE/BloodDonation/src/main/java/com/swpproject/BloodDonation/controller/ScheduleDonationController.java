package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.ScheduleDonationRequest;
import com.swpproject.BloodDonation.dto.response.ScheduleDonationResponse;
import com.swpproject.BloodDonation.dto.response.TimeSlotResponse;
import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.service.ScheduleDonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedule-donations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScheduleDonationController {

    private final ScheduleDonationService scheduleDonationService;

    @GetMapping("/")
    public ResponseEntity<List<ScheduleDonationResponse>> getAllScheduleDonationsForFrontend() {
        List<ScheduleDonation> scheduleDonations = scheduleDonationService.getAllScheduleDonations();
        List<ScheduleDonationResponse> responseDtos = scheduleDonations.stream()
                .map(this::convertToFrontendFormat)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDtos);
    }

    private ScheduleDonationResponse convertToFrontendFormat(ScheduleDonation scheduleDonation) {
        String center = "";
        String location = scheduleDonation.getAddress();

        if (scheduleDonation.getAddress() != null && scheduleDonation.getAddress().contains(" - ")) {
            String[] parts = scheduleDonation.getAddress().split(" - ", 2);
//            center = parts[0];
            location = parts[1];
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String dateStr = scheduleDonation.getDate().format(dateFormatter);

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        List<TimeSlotResponse> timeSlotDtos = scheduleDonation.getTimeSlots().stream()
                .map(timeSlot -> {
                    return TimeSlotResponse.builder()
                            .id(timeSlot.getId())
                            .startTime(LocalTime.parse(timeSlot.getStartTime().format(timeFormatter)))
                            .endTime(LocalTime.parse(timeSlot.getEndTime().format(timeFormatter)))
                            .build();
                })
                .collect(Collectors.toList());

        return ScheduleDonationResponse.builder()
                .scheduleId(scheduleDonation.getScheduleId())
                .center(scheduleDonation.getCenter())
                .location(location)
                .date(dateStr)
                .timeSlots(timeSlotDtos)
                .donorCount(scheduleDonation.getNumberOfDonor())
                .updateBy(scheduleDonation.getUpdateBy())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ScheduleDonationResponse> createSchedule(@RequestBody ScheduleDonationRequest request) {
        ScheduleDonationResponse response = scheduleDonationService.createSchedule(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ScheduleDonationResponse>> getAllSchedules() {
        List<ScheduleDonationResponse> schedules = scheduleDonationService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/future")
    public ResponseEntity<List<ScheduleDonationResponse>> getFutureSchedules() {
        List<ScheduleDonationResponse> schedules = scheduleDonationService.getFutureSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{scheduleId}")
    public ResponseEntity<ScheduleDonationResponse> getScheduleById(@PathVariable String scheduleId) {
        ScheduleDonationResponse schedule = scheduleDonationService.getScheduleById(scheduleId);
        return ResponseEntity.ok(schedule);
    }

    @PutMapping("/{scheduleId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ScheduleDonationResponse> updateSchedule(
            @PathVariable String scheduleId,
            @RequestBody ScheduleDonationRequest request) {
        ScheduleDonationResponse response = scheduleDonationService.updateSchedule(scheduleId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{scheduleId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String scheduleId) {
        scheduleDonationService.deleteSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
