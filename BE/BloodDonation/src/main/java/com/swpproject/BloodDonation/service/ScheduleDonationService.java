package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.ScheduleDonationRequest;
import com.swpproject.BloodDonation.dto.request.TimeSlotRequest;
import com.swpproject.BloodDonation.dto.response.ScheduleDonationResponse;
import com.swpproject.BloodDonation.dto.response.TimeSlotResponse;
import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.entity.TimeSlot;
import com.swpproject.BloodDonation.repository.BookingDonationRepository;
import com.swpproject.BloodDonation.repository.ScheduleDonationRepository;
import com.swpproject.BloodDonation.repository.SurveyRepository;
import com.swpproject.BloodDonation.repository.TimeSlotRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleDonationService {

    private final ScheduleDonationRepository scheduleDonationRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final BookingDonationRepository bookingDonationRepository;
    private final SurveyRepository surveyRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Tạo mới lịch hiến máu
     */
    @Transactional
    @PreAuthorize("hasAuthority('STAFF')")
    public ScheduleDonationResponse createSchedule(ScheduleDonationRequest request) {
        // Kiểm tra tính hợp lệ của request
        validateScheduleRequest(request);

        // Lấy thông tin người dùng hiện tại
        String currentUser = getCurrentUsername();

        // Tạo đối tượng schedule
        String scheduleId = UUID.randomUUID().toString();
        ScheduleDonation schedule = ScheduleDonation.builder()
                .scheduleId(scheduleId)
                .date(request.getDate())
                .address(request.getAddress())
                .center(request.getCenter())
                .numberOfDonor(request.getNumberOfDonor())
                .bloodNeed(request.getBloodNeed())
                .updateBy(currentUser)
                .timeSlots(new ArrayList<>())
                .build();

        // Lưu schedule để lấy ID
        ScheduleDonation savedSchedule = scheduleDonationRepository.save(schedule);

        // Tạo và liên kết các time slot
        List<TimeSlot> timeSlots = request.getTimeSlots().stream()
                .map(timeSlotRequest -> TimeSlot.builder()
                        .startTime(timeSlotRequest.getStartTime())
                        .endTime(timeSlotRequest.getEndTime())
                        .scheduleDonation(savedSchedule)
                        .build())
                .collect(Collectors.toList());

        // Sử dụng phương thức addTimeSlot có sẵn trong entity
        timeSlots.forEach(savedSchedule::addTimeSlot);

        ScheduleDonation updatedSchedule = scheduleDonationRepository.save(savedSchedule);

        // Chuyển đổi thành response
        return convertToScheduleDonationResponse(updatedSchedule);
    }

    /**
     * Lấy tất cả lịch hiến máu
     */
    public List<ScheduleDonationResponse> getAllSchedules() {
        List<ScheduleDonation> schedules = scheduleDonationRepository.findAll();

        return schedules.stream()
                .map(this::convertToScheduleDonationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy các lịch hiến máu trong tương lai
     */
    public List<ScheduleDonationResponse> getFutureSchedules() {
        LocalDate today = LocalDate.now();
        List<ScheduleDonation> schedules = scheduleDonationRepository.findByDateGreaterThanEqual(today);

        return schedules.stream()
                .map(this::convertToScheduleDonationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy lịch hiến máu theo ID
     */
    public ScheduleDonationResponse getScheduleById(String scheduleId) {
        ScheduleDonation schedule = scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + scheduleId));

        return convertToScheduleDonationResponse(schedule);
    }

    /**
     * Cập nhật lịch hiến máu
     */
    @Transactional
    public ScheduleDonationResponse updateSchedule(String scheduleId, ScheduleDonationRequest request) {
        // Kiểm tra tính hợp lệ của request
        validateScheduleRequest(request);

        // Lấy thông tin người dùng hiện tại
        String currentUser = getCurrentUsername();

        // Tìm schedule hiện có
        ScheduleDonation existingSchedule = scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + scheduleId));

        // Cập nhật các trường cơ bản
        existingSchedule.setDate(request.getDate());
        existingSchedule.setAddress(request.getAddress());
        existingSchedule.setCenter(request.getCenter());
        existingSchedule.setNumberOfDonor(request.getNumberOfDonor());
        existingSchedule.setBloodNeed(request.getBloodNeed());
        existingSchedule.setUpdateBy(currentUser);

        // Xóa tất cả time slot hiện có
        new ArrayList<>(existingSchedule.getTimeSlots()).forEach(existingSchedule::removeTimeSlot);

        // Tạo time slot mới
        List<TimeSlot> newTimeSlots = request.getTimeSlots().stream()
                .map(timeSlotRequest -> TimeSlot.builder()
                        .startTime(timeSlotRequest.getStartTime())
                        .endTime(timeSlotRequest.getEndTime())
                        .scheduleDonation(existingSchedule)
                        .build())
                .collect(Collectors.toList());

        // Sử dụng phương thức addTimeSlot có sẵn trong entity
        newTimeSlots.forEach(existingSchedule::addTimeSlot);

        ScheduleDonation updatedSchedule = scheduleDonationRepository.save(existingSchedule);

        return convertToScheduleDonationResponse(updatedSchedule);
    }

    /**
     * Xóa lịch hiến máu
     */
    @Transactional
    public void deleteSchedule(String scheduleId) {
        ScheduleDonation schedule = scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + scheduleId));

        // 1. Xóa survey liên quan
        surveyRepository.deleteSurveysByScheduleId(scheduleId);

        // 2. Xóa booking liên quan
        bookingDonationRepository.deleteByScheduleId(scheduleId);

        // 3. Xóa schedule
        scheduleDonationRepository.delete(schedule);
    }

    /**
     * Kiểm tra tính hợp lệ của request tạo/cập nhật lịch
     */
    private void validateScheduleRequest(ScheduleDonationRequest request) {
        if (request.getDate() == null) {
            throw new IllegalArgumentException("Donation date must not be empty");
        }

        if (request.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Donation date must be in the future");
        }

        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Address must not be empty");
        }

        if (request.getCenter() == null || request.getCenter().trim().isEmpty()) {
            throw new IllegalArgumentException("Donation center must not be empty");
        }

        if (request.getNumberOfDonor() == null || request.getNumberOfDonor() <= 0) {
            throw new IllegalArgumentException("Number of donors must be greater than 0");
        }

        if (request.getTimeSlots() == null || request.getTimeSlots().isEmpty()) {
            throw new IllegalArgumentException("At least one time slot is required");
        }

        // Kiểm tra tính hợp lệ của các khung giờ
        for (TimeSlotRequest timeSlot : request.getTimeSlots()) {
            if (timeSlot.getStartTime() == null || timeSlot.getEndTime() == null) {
                throw new IllegalArgumentException("Start time and end time must not be empty");
            }

            if (timeSlot.getStartTime().isAfter(timeSlot.getEndTime()) ||
                    timeSlot.getStartTime().equals(timeSlot.getEndTime())) {
                throw new IllegalArgumentException("End time must be after start time");
            }
        }
    }

    /**
     * Chuyển đổi entity sang response DTO
     */
    private ScheduleDonationResponse convertToScheduleDonationResponse(ScheduleDonation schedule) {
        // Danh sách các timeSlot
        List<TimeSlotResponse> timeSlotResponses = schedule.getTimeSlots().stream()
                .map(timeSlot -> TimeSlotResponse.builder()
                        .id(timeSlot.getId())
                        .startTime(timeSlot.getStartTime())
                        .endTime(timeSlot.getEndTime())
                        .build())
                .collect(Collectors.toList());

        List<BookingDonation> bookings = bookingDonationRepository.findByScheduleDonation(schedule);
        int registeredCount = bookings.size();

        return ScheduleDonationResponse.builder()
                .scheduleId(schedule.getScheduleId())
                .center(schedule.getCenter())
                .location(schedule.getAddress()) // address -> location
                .date(schedule.getDate().format(DATE_FORMATTER))
                .timeSlots(timeSlotResponses)
                .bloodNeed(schedule.getBloodNeed())
                .donorCount(schedule.getNumberOfDonor()) // numberOfDonor -> donorCount
                .updateBy(schedule.getUpdateBy())
                .currentDonorCount(registeredCount)
                .registrationStatus(registeredCount + "/" + schedule.getNumberOfDonor() + " registered")
                .build();
    }

    /**
     * Lấy username hiện tại
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : "system";
    }

    /**
     * Lấy tất cả entity ScheduleDonation
     */
    public List<ScheduleDonation> getAllScheduleDonations() {
        return scheduleDonationRepository.findAll();
    }
}