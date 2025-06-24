package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.response.ScheduleDonationResponse;
import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.service.ScheduleDonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            center = parts[0];
            location = parts[1];
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String dateStr = scheduleDonation.getDate().format(dateFormatter);

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        List<ScheduleDonationResponse.TimeSlotDto> timeSlotDtos = scheduleDonation.getTimeSlots().stream()
                .map(timeSlot -> {
                    return ScheduleDonationResponse.TimeSlotDto.builder()
                            .id(timeSlot.getId())
                            .startTime(timeSlot.getStartTime().format(timeFormatter))
                            .endTime(timeSlot.getEndTime().format(timeFormatter))
                            .build();
                })
                .collect(Collectors.toList());

        return ScheduleDonationResponse.builder()
                .scheduleId(scheduleDonation.getScheduleId())
                .center(center)
                .location(location)
                .date(dateStr)
                .timeSlots(timeSlotDtos)
                .donorCount(scheduleDonation.getNumberOfDonor())
                .updateBy(scheduleDonation.getUpdateBy())
                .build();
    }
}
