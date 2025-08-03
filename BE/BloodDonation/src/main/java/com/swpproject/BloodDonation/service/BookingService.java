package com.swpproject.BloodDonation.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swpproject.BloodDonation.dto.request.BookingWithSurveyRequest;
import com.swpproject.BloodDonation.dto.request.CheckOutRequestDTO;
import com.swpproject.BloodDonation.dto.request.SurveyRequest;
import com.swpproject.BloodDonation.dto.response.BookingResponse;
import com.swpproject.BloodDonation.entity.*;
import com.swpproject.BloodDonation.enums.Status;
import com.swpproject.BloodDonation.repository.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
// @Transactional để đảm bảo các thao tác với cơ sở dữ liệu được thực hiện trong một
public class BookingService {

    private final BookingDonationRepository bookingDonationRepository;
    private final SurveyRepository surveyRepository;
    private final ScheduleDonationRepository scheduleDonationRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final CertificateRepository certificateRepository;
    private final DonationReportService donationReportService;
    private final BloodInventoryService bloodInventoryService;
    private final NotificationEventPublisher notificationPublisher;
    private final MailService mailService;
    private final CheckInCodeService checkInCodeService;


    @Transactional
    @PreAuthorize("isAuthenticated()") // cho phép nếu đã đăng nhập
    public BookingResponse createBookingWithSurvey(BookingWithSurveyRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean canDonate = donationReportService.canUserDonate(user.getUserID());
        if (!canDonate) {
            throw new RuntimeException("You are not eligible to donate blood at this time. Please check your donation history or contact support for more information.");
        }

        ScheduleDonation scheduleDonation;
        if (request.getBooking().getScheduleId() != null && !request.getBooking().getScheduleId().isEmpty()) {
            scheduleDonation = scheduleDonationRepository.findById(request.getBooking().getScheduleId())
                    .orElseThrow(() -> new RuntimeException("Schedule donation not found with ID: " +
                            request.getBooking().getScheduleId()));
        } else {
            try {
                scheduleDonation = scheduleDonationRepository.findByDateAndAddress(
                                request.getBooking().getDate(),
                                request.getBooking().getLocation())
                        .orElseThrow(() -> new RuntimeException("Schedule donation not found with exact address"));
            } catch (RuntimeException e) {
                scheduleDonation = scheduleDonationRepository.findAll().stream()
                        .filter(sd -> sd.getDate().equals(request.getBooking().getDate()))
                        .filter(sd -> sd.getAddress().contains(request.getBooking().getLocation()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Schedule donation not found"));
            }
        }

        TimeSlot foundTimeSlot;
        LocalTime parsedStartTime;
        LocalTime parsedEndTime;

        String timeSlotValue = request.getBooking().getTimeSlot();
        try {
            Long timeSlotId = Long.parseLong(timeSlotValue);
            foundTimeSlot = timeSlotRepository.findById(timeSlotId)
                    .orElseThrow(() -> new RuntimeException("Time slot not found with ID: " + timeSlotId));
            parsedStartTime = foundTimeSlot.getStartTime();
            parsedEndTime = foundTimeSlot.getEndTime();
        } catch (NumberFormatException e) {
            try {
                String[] timeSlotParts = timeSlotValue.split("-");
                parsedStartTime = LocalTime.parse(timeSlotParts[0].trim());
                parsedEndTime = LocalTime.parse(timeSlotParts[1].trim());

                final LocalTime lambdaStartTime = parsedStartTime;
                final LocalTime lambdaEndTime = parsedEndTime;

                foundTimeSlot = timeSlotRepository.findByScheduleDonationAndStartTimeAndEndTime(
                                scheduleDonation, parsedStartTime, parsedEndTime)
                        .orElseThrow(() -> new RuntimeException("Time slot not found with times: " + lambdaStartTime + "-" + lambdaEndTime));
            } catch (Exception ex) {
                throw new RuntimeException("Invalid time slot format. Expected either a numeric ID or a time range in format 'HH:mm-HH:mm'");
            }
        }

        final TimeSlot timeSlot = foundTimeSlot;
        final LocalTime startTime = parsedStartTime;
        final LocalTime endTime = parsedEndTime;

        String bookingId = UUID.randomUUID().toString();
        // them thoi gian dat lich
        LocalDateTime now = LocalDateTime.now();

        BookingDonation bookingDonation = BookingDonation.builder()
                .donationId(bookingId)
                .dateDonation(request.getBooking().getDate())
                .startTime(startTime)
                .endTime(endTime)
                .address(request.getBooking().getLocation() + " - " + request.getBooking().getCenter())
                .center(request.getBooking().getCenter())
                .status(Status.PENDING)
                .scheduleDonation(scheduleDonation)
                .donor(user)
                .bookingTime(now)
                .build();

        BookingDonation savedBookingDonation = bookingDonationRepository.save(bookingDonation);

        List<Survey> surveys = request.getSurvey().stream()
                .map(surveyRequest -> createSurvey(surveyRequest, savedBookingDonation))
                .collect(Collectors.toList());
        surveyRepository.saveAll(surveys);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedBookingTime = savedBookingDonation.getBookingTime().format(formatter);

        return BookingResponse.builder()
                .bookingId(savedBookingDonation.getDonationId())
                .dateDonation(savedBookingDonation.getDateDonation())
                .startTime(savedBookingDonation.getStartTime())
                .endTime(savedBookingDonation.getEndTime())
                .address(savedBookingDonation.getAddress())
                .status(String.valueOf(savedBookingDonation.getStatus()))
                .center(savedBookingDonation.getCenter())
                .message("Booking created successfully")
                .bookingTime(savedBookingDonation.getBookingTime())
                .formattedBookingTime("Booking at: " + formattedBookingTime)
                .build();
    }

    private Survey createSurvey(SurveyRequest surveyRequest, BookingDonation bookingDonation) {
        try {
            // Create a map to represent the JSON structure
            Map<String, String> answerMap = new HashMap<>();
            answerMap.put("answer", surveyRequest.getAnswer());
            answerMap.put("additionalInfo", surveyRequest.getAdditionalInfo() != null ? surveyRequest.getAdditionalInfo() : "");

            // Use ObjectMapper to properly handle character encoding
            ObjectMapper objectMapper = new ObjectMapper();
            String answerAudit = objectMapper.writeValueAsString(answerMap);

            return Survey.builder()
                    .surveyId(UUID.randomUUID().toString())
                    .description(surveyRequest.getQuestionId())
                    .answerAudit(answerAudit)
                    .bookingDonation(bookingDonation)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error creating survey: " + e.getMessage(), e);
        }
    }

    public List<BookingResponse> getUserBookingsByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<BookingDonation> bookings = bookingDonationRepository.findByDonor(user);

        return bookings.stream()
                .map(booking -> BookingResponse.builder()
                        .bookingId(booking.getDonationId())
                        .dateDonation(booking.getDateDonation())
                        .startTime(booking.getStartTime())
                        .endTime(booking.getEndTime())
                        .address(booking.getAddress())
                        .status(String.valueOf(booking.getStatus()))
                        .center(booking.getCenter())
                        .build())
                .collect(Collectors.toList());
    }

    public List<Survey> getSurveysByBookingId(String bookingId) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return surveyRepository.findByBookingDonation(booking);
    }

    public BookingResponse getBookingById(String bookingId) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        return BookingResponse.builder()
                .bookingId(booking.getDonationId())
                .dateDonation(booking.getDateDonation())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .address(booking.getAddress())
                .center(booking.getCenter())
                .status(String.valueOf(booking.getStatus()))
                .user(booking.getDonor())
                .build();
    }


    public List<BookingResponse> getAllBookings() {
        List<BookingDonation> bookings = bookingDonationRepository.findAll();

        return bookings.stream()
                .map(booking -> {
                    String formattedTime = null;
                    if (booking.getBookingTime() != null) {
                        formattedTime = "Đã đặt lịch lúc: " +
                                booking.getBookingTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                    }

                    return BookingResponse.builder()
                            .bookingId(booking.getDonationId())
                            .dateDonation(booking.getDateDonation())
                            .startTime(booking.getStartTime())
                            .endTime(booking.getEndTime())
                            .address(booking.getAddress())
                            .status(String.valueOf(booking.getStatus()))
                            .center(booking.getCenter())
                            .user(booking.getDonor())
                            .bookingTime(booking.getBookingTime())
                            .formattedBookingTime(formattedTime)
                            .build();
                })

                .collect(Collectors.toList());
    }
    public void deleteBooking(String bookingId) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        List<Survey> surveys = surveyRepository.findByBookingDonation(booking);
        surveyRepository.deleteAll(surveys);

        bookingDonationRepository.delete(booking);
    }

    @Transactional
    // Chuyển trạng thái booking và gửi email thông báo (nội dung email bằng tiếng Anh)
    public void updateBookingStatus(String bookingId, String status) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Lưu trạng thái cũ để kiểm tra sự thay đổi
        Status oldStatus = booking.getStatus();

        // Convert String status to Status enum
        Status statusEnum = Status.valueOf(status);
        booking.setStatus(statusEnum);
        bookingDonationRepository.save(booking);

        // Nếu booking mới được đánh dấu hoàn thành
        if (statusEnum == Status.COMPLETED && oldStatus != Status.COMPLETED) {
            // Tạo chứng chỉ
            Certificate cert = new Certificate();
            cert.setUser(booking.getDonor());
            cert.setDonationDate(booking.getDateDonation());
            cert.setBookingId(booking.getDonationId());
            certificateRepository.save(cert);

            // TÍCH HỢP: Thêm máu vào kho
            String donorId = booking.getDonor().getUserID();
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String staffId = authentication.getName();

            try {
                // Thêm máu vào kho
                bloodInventoryService.addBloodToDonation(
                        donorId,
                        bookingId,
                        "Regular Donation",
                        staffId
                );

                // Gửi thông báo cho người hiến máu - SỬ DỤNG EVENT PUBLISHER
                notificationPublisher.publishNotificationCreatedEvent(
                        donorId,
                        "Blood donation successful",
                        "Thank you for your successful blood donation. Your 350ml of blood has been added to the blood inventory and will help save lives.",
                        "/donations/history",
                        "DONATION_COMPLETED",
                        "NORMAL"
                );
            } catch (Exception e) {
                // Log lỗi nhưng không throw exception để không làm gián đoạn quy trình
                // Vẫn tiếp tục đánh dấu lịch hiến máu là hoàn thành
                System.err.println("Error updating blood inventory: " + e.getMessage());
                e.printStackTrace();
            }
        }

        if (oldStatus != statusEnum) {
            sendStatusChangeEmail(booking, statusEnum);
        }
    }

    private void sendStatusChangeEmail(BookingDonation booking, Status newStatus) {
        User donor = booking.getDonor();
        String donorEmail = donor.getEmail();
        String donorName = donor.getFullName();

        String subject = "Blood Donation Booking Status Update";
        String content = buildEmailContent(donorName, booking, newStatus);

        try {
            mailService.sendEmail(subject, content, donorEmail);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send status change email to {} for booking {}: {}", donorEmail, booking.getDonationId(), e.getMessage(), e);
        }
    }

    // Helper build nội dung email (nội dung bằng tiếng Anh)
    private String buildEmailContent(String donorName, BookingDonation booking, Status newStatus) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String bookingTime = booking.getBookingTime() != null ? booking.getBookingTime().format(formatter) : "N/A";

        String statusMessage;
        switch (newStatus) {
            case COMPLETED:
                statusMessage = "Your blood donation booking has been successfully completed!";
                break;
            case CANCELLED:
                statusMessage = "Your blood donation booking has been cancelled.";
                break;
            case PENDING:
                statusMessage = "Your blood donation booking is pending confirmation.";
                break;
            default:
                statusMessage = "The status of your blood donation booking has changed to " + newStatus;
        }

        return "<h2>Hello " + donorName + ",</h2>" +
                "<p>" + statusMessage + "</p>" +
                "<p>Booking details:</p>" +
                "<ul>" +
                "<li>Donation date: " + booking.getDateDonation() + "</li>" +
                "<li>Time: " + booking.getStartTime() + " - " + booking.getEndTime() + "</li>" +
                "<li>Location: " + booking.getAddress() + "</li>" +
                "<li>Center: " + booking.getCenter() + "</li>" +
                "<li>Booking time: " + bookingTime + "</li>" +
                "</ul>" +
                "<p>If you have any questions, please contact our support team.</p>" +
                "<br><p>Best regards,<br>BloodDonation Team</p>";
    }

    @Transactional
    @PreAuthorize("hasAuthority('STAFF')")
    public BookingResponse approveBookingWithCheckInCode(String bookingId, String staffId) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Check if it's in PENDING status
        if (booking.getStatus() != Status.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be approved");
        }

        // Update status
        booking.setStatus(Status.APPROVED);

        // Generate check-in code if not already assigned
        if (booking.getCheckInCode() == null || booking.getCheckInCode().isEmpty()) {
            String checkInCode = checkInCodeService.generateUniqueCode();
            booking.setCheckInCode(checkInCode);
        }

        BookingDonation savedBooking = bookingDonationRepository.save(booking);

        // Send notification with check-in code
        sendCheckInCodeNotification(savedBooking);

        return mapToBookingResponse(savedBooking);
    }

    /**
     * Send notification with check-in code
     */
    private void sendCheckInCodeNotification(BookingDonation booking) {
        User donor = booking.getDonor();

        // Send app notification
        notificationPublisher.publishNotificationCreatedEvent(
                donor.getUserID(),
                "Booking Approved - Check-in Code: " + booking.getCheckInCode(),
                "Your blood donation booking has been approved. Your check-in code is: " +
                        booking.getCheckInCode() + ". Please bring this code when you arrive at the donation center.",
                "/donations/upcoming",
                "BOOKING_APPROVED",
                "HIGH"
        );

        // Send email notification
        String subject = "Blood Donation Booking Approved - Check-in Code";
        String content = "<h2>Hello " + donor.getFullName() + ",</h2>" +
                "<p>Your blood donation booking has been <strong>approved</strong>.</p>" +
                "<p>Here is your check-in code:</p>" +
                "<h1 style='color: #c0392b; font-size: 32px; text-align: center; " +
                "border: 2px dashed #c0392b; padding: 10px; margin: 20px 0;'>" +
                booking.getCheckInCode() + "</h1>" +
                "<p>Please provide this code when you arrive at the donation center.</p>" +
                "<p><strong>Booking details:</strong></p>" +
                "<ul>" +
                "<li>Date: " + booking.getDateDonation() + "</li>" +
                "<li>Time: " + booking.getStartTime() + " - " + booking.getEndTime() + "</li>" +
                "<li>Location: " + booking.getAddress() + "</li>" +
                "</ul>" +
                "<p>Thank you for your contribution to saving lives!</p>" +
                "<br><p>Best regards,<br>BloodDonation Team</p>";

        try {
            mailService.sendEmail(subject, content, donor.getEmail());
        } catch (Exception e) {
            log.error("Failed to send check-in code email: {}", e.getMessage(), e);
        }
    }

    /**
     * Check-in a donor using check-in code
     */
    @Transactional
    @PreAuthorize("hasAuthority('STAFF')")
    public BookingResponse checkInDonorByCode(String checkInCode, String staffId) {
        BookingDonation booking = bookingDonationRepository.findByCheckInCode(checkInCode)
                .orElseThrow(() -> new RuntimeException("Invalid check-in code"));

        // Check current status
        if (booking.getStatus() != Status.APPROVED && booking.getStatus() != Status.PENDING) {
            throw new RuntimeException("Booking must be in APPROVED or PENDING status to check-in");
        }

        // Check if already checked in
        if (booking.getCheckInTime() != null) {
            throw new RuntimeException("Donor has already been checked in");
        }

        // Record check-in
        booking.setCheckInTime(LocalDateTime.now());
        booking.setCheckInBy(staffId);

        // Ensure status is APPROVED
        if (booking.getStatus() != Status.APPROVED) {
            booking.setStatus(Status.APPROVED);
        }

        BookingDonation savedBooking = bookingDonationRepository.save(booking);

        // Send check-in notification
        notificationPublisher.publishNotificationCreatedEvent(
                savedBooking.getDonor().getUserID(),
                "Check-in Successful",
                "You have been successfully checked in for your blood donation at " +
                        savedBooking.getAddress() + ".",
                "/donations/current",
                "CHECKIN_COMPLETED",
                "NORMAL"
        );

        return mapToBookingResponse(savedBooking);
    }

    /**
     * Check-out a donor after donation
     */
    @Transactional
    @PreAuthorize("hasAuthority('STAFF')")
    public BookingResponse checkOutDonor(String bookingId, CheckOutRequestDTO request, String staffId) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Check if already checked in
        if (booking.getCheckInTime() == null) {
            throw new RuntimeException("Donor must be checked in before checkout");
        }

        // Check if already checked out
        if (booking.getCheckOutTime() != null) {
            throw new RuntimeException("Donor has already been checked out");
        }

        // Record check-out
        booking.setCheckOutTime(LocalDateTime.now());
        booking.setCheckOutBy(staffId);
        booking.setCheckOutNotes(request.getNotes());

        // Update status to COMPLETED
        booking.setStatus(Status.COMPLETED);
        BookingDonation savedBooking = bookingDonationRepository.save(booking);

        // Process completion (certificate, blood inventory, etc.)
        updateBookingStatus(bookingId, "COMPLETED");

        return mapToBookingResponse(savedBooking);
    }

    /**
     * Mark donor as no-show
     */
    @Transactional
    @PreAuthorize("hasAuthority('STAFF')")
    public BookingResponse markAsNoShow(String bookingId, String staffId) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Check if already checked in
        if (booking.getCheckInTime() != null) {
            throw new RuntimeException("Donor has already checked in, cannot mark as no-show");
        }

        // Check status
        if (booking.getStatus() != Status.APPROVED && booking.getStatus() != Status.PENDING) {
            throw new RuntimeException("Only APPROVED or PENDING bookings can be marked as no-show");
        }

        // Update status
        booking.setStatus(Status.NO_SHOW);
        BookingDonation savedBooking = bookingDonationRepository.save(booking);

        // Send notification
        notificationPublisher.publishNotificationCreatedEvent(
                savedBooking.getDonor().getUserID(),
                "Missed Blood Donation Appointment",
                "You were marked as no-show for your blood donation appointment. If you still want to donate, please book a new appointment.",
                "/donations/history",
                "MISSED_APPOINTMENT",
                "NORMAL"
        );

        return mapToBookingResponse(savedBooking);
    }

    /**
     * Get booking by check-in code
     */
    public BookingResponse getBookingByCheckInCode(String checkInCode) {
        BookingDonation booking = bookingDonationRepository.findByCheckInCode(checkInCode)
                .orElseThrow(() -> new RuntimeException("No booking found with check-in code: " + checkInCode));

        return mapToBookingResponse(booking);
    }

    /**
     * Map entity to DTO (update to include check-in/out fields)
     */
    private BookingResponse mapToBookingResponse(BookingDonation booking) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedBookingTime = booking.getBookingTime() != null ?
                booking.getBookingTime().format(formatter) : null;

        return BookingResponse.builder()
                .bookingId(booking.getDonationId())
                .dateDonation(booking.getDateDonation())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .address(booking.getAddress())
                .status(String.valueOf(booking.getStatus()))
                .center(booking.getCenter())
                .user(booking.getDonor())
                .bookingTime(booking.getBookingTime())
                .formattedBookingTime(formattedBookingTime != null ? "Booking at: " + formattedBookingTime : null)
                // Add check-in/out fields
                .checkInCode(booking.getCheckInCode())
                .checkInTime(booking.getCheckInTime())
                .checkInBy(booking.getCheckInBy())
                .checkOutTime(booking.getCheckOutTime())
                .checkOutBy(booking.getCheckOutBy())
                .checkOutNotes(booking.getCheckOutNotes())
                .build();
    }
}


