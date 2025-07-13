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
import com.swpproject.BloodDonation.repository.TimeSlotRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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


    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Transactional
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

    public List<ScheduleDonationResponse> getAllSchedules() {
        List<ScheduleDonation> schedules = scheduleDonationRepository.findAll();

        return schedules.stream()
                .map(this::convertToScheduleDonationResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleDonationResponse> getFutureSchedules() {
        LocalDate today = LocalDate.now();
        List<ScheduleDonation> schedules = scheduleDonationRepository.findByDateGreaterThanEqual(today);

        return schedules.stream()
                .map(this::convertToScheduleDonationResponse)
                .collect(Collectors.toList());
    }

    public ScheduleDonationResponse getScheduleById(String scheduleId) {
        ScheduleDonation schedule = scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hiến máu với ID: " + scheduleId));

        return convertToScheduleDonationResponse(schedule);
    }

    @Transactional
    public ScheduleDonationResponse updateSchedule(String scheduleId, ScheduleDonationRequest request) {
        // Kiểm tra tính hợp lệ của request
        validateScheduleRequest(request);

        // Lấy thông tin người dùng hiện tại
        String currentUser = getCurrentUsername();

        // Tìm schedule hiện có
        ScheduleDonation existingSchedule = scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hiến máu với ID: " + scheduleId));

        // Cập nhật các trường cơ bản
        existingSchedule.setDate(request.getDate());
        existingSchedule.setAddress(request.getAddress());
        existingSchedule.setCenter(request.getCenter());
        existingSchedule.setNumberOfDonor(request.getNumberOfDonor());
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

    @Transactional
    public void deleteSchedule(String scheduleId) {
        ScheduleDonation schedule = scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hiến máu với ID: " + scheduleId));

        scheduleDonationRepository.delete(schedule);
    }

    private void validateScheduleRequest(ScheduleDonationRequest request) {
        if (request.getDate() == null) {
            throw new IllegalArgumentException("Ngày hiến máu không được để trống");
        }

        if (request.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày hiến máu phải là ngày trong tương lai");
        }

        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Địa chỉ không được để trống");
        }

        if (request.getCenter() == null || request.getCenter().trim().isEmpty()) {
            throw new IllegalArgumentException("Trung tâm hiến máu không được để trống");
        }

        if (request.getNumberOfDonor() == null || request.getNumberOfDonor() <= 0) {
            throw new IllegalArgumentException("Số lượng người hiến máu phải lớn hơn 0");
        }

        if (request.getTimeSlots() == null || request.getTimeSlots().isEmpty()) {
            throw new IllegalArgumentException("Phải có ít nhất một khung giờ");
        }

        // Kiểm tra tính hợp lệ của các khung giờ
        for (TimeSlotRequest timeSlot : request.getTimeSlots()) {
            if (timeSlot.getStartTime() == null || timeSlot.getEndTime() == null) {
                throw new IllegalArgumentException("Giờ bắt đầu và giờ kết thúc không được để trống");
            }

            if (timeSlot.getStartTime().isAfter(timeSlot.getEndTime()) ||
                    timeSlot.getStartTime().equals(timeSlot.getEndTime())) {
                throw new IllegalArgumentException("Giờ kết thúc phải sau giờ bắt đầu");
            }
        }
    }

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
                .location(schedule.getAddress()) // Ánh xạ address -> location
                .date(schedule.getDate().format(DATE_FORMATTER))
                .timeSlots(timeSlotResponses)
                .donorCount(schedule.getNumberOfDonor()) // numberOfDonor -> donorCount
                .updateBy(schedule.getUpdateBy())
                .currentDonorCount(registeredCount)
                .registrationStatus(registeredCount + "/" + schedule.getNumberOfDonor() + " đã đăng ký")
                .build();
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : "system";
    }

    public List<ScheduleDonation> getAllScheduleDonations() {
        return scheduleDonationRepository.findAll();
    }
}