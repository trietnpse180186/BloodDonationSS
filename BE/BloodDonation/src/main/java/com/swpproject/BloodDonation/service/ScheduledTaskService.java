package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.enums.Status;
import com.swpproject.BloodDonation.repository.BookingDonationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTaskService {

    private final BookingDonationRepository bookingRepository;
    private final NotificationEventPublisher notificationPublisher;

    /**
     * Mark donors as no-show at the end of the day
     * Runs at 11:59 PM every day
     */
    @Scheduled(cron = "0 59 23 * * *")
    @Transactional
    public void markNoShows() {
        LocalDate today = LocalDate.now();

        // Find all approved bookings for today without check-in
        List<BookingDonation> missedBookings =
                bookingRepository.findByDateDonationAndStatusAndCheckInTimeIsNull(today, Status.APPROVED);

        for (BookingDonation booking : missedBookings) {
            // Mark as NO_SHOW
            booking.setStatus(Status.NO_SHOW);
            bookingRepository.save(booking);

            // Notify donor
            notificationPublisher.publishNotificationCreatedEvent(
                    booking.getDonor().getUserID(),
                    "Missed Blood Donation Appointment",
                    "You were marked as no-show for your blood donation appointment. If you still want to donate, please book a new appointment.",
                    "/donations/history",
                    "MISSED_APPOINTMENT",
                    "NORMAL"
            );

            log.info("Marked booking {} as NO_SHOW automatically", booking.getDonationId());
        }
    }

    /**
     * Send appointment reminders one day before
     * Runs at 9:00 AM every day
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional(readOnly = true)
    public void sendAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // Find all approved bookings for tomorrow
        List<BookingDonation> tomorrowBookings =
                bookingRepository.findByDateDonationAndStatus(tomorrow, Status.APPROVED);

        for (BookingDonation booking : tomorrowBookings) {
            // Send reminder
            notificationPublisher.publishNotificationCreatedEvent(
                    booking.getDonor().getUserID(),
                    "Reminder: Blood Donation Appointment Tomorrow",
                    "Don't forget your blood donation appointment tomorrow at " +
                            booking.getStartTime() + " - " + booking.getEndTime() +
                            " at " + booking.getAddress() + ". Please bring your check-in code: " +
                            booking.getCheckInCode(),
                    "/donations/upcoming",
                    "APPOINTMENT_REMINDER",
                    "HIGH"
            );

            log.info("Sent reminder for booking {}", booking.getDonationId());
        }
    }
}