package com.swpproject.BloodDonation.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swpproject.BloodDonation.dto.request.BookingWithSurveyRequest;
import com.swpproject.BloodDonation.dto.request.SurveyRequest;
import com.swpproject.BloodDonation.dto.response.BookingResponse;
import com.swpproject.BloodDonation.entity.*;
import com.swpproject.BloodDonation.enums.Status;
import com.swpproject.BloodDonation.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class BookingService {

    private final BookingDonationRepository bookingDonationRepository;
    private final SurveyRepository surveyRepository;
    private final ScheduleDonationRepository scheduleDonationRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Transactional
    public BookingResponse createBookingWithSurvey(BookingWithSurveyRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                .formattedBookingTime("Đã đặt lịch lúc: " + formattedBookingTime)
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

    public void updateBookingStatus(String bookingId, String status) {
        BookingDonation booking = bookingDonationRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Convert String status to Status enum
        Status statusEnum = Status.valueOf(status);
        booking.setStatus(statusEnum);
        bookingDonationRepository.save(booking);
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

}