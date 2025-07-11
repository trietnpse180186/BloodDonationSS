
package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.NotificationRequest;
import com.swpproject.BloodDonation.dto.response.NotificationResponse;
import com.swpproject.BloodDonation.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
@RequiredArgsConstructor

public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public NotificationResponse createNotification(@RequestBody NotificationRequest request) {
        return notificationService.create(request);
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponse> getNotificationsByUserId(@PathVariable String userId) {
        return notificationService.getByUserId(userId);
    }

    @GetMapping("/all")
    public List<NotificationResponse> getAllNotification(){
        return notificationService.getAllNotification();
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponse> updateStatus (@PathVariable String id, @RequestParam String status){
        NotificationResponse updateNotification = notificationService.getNotificationById(id);
        notificationService.updateStatus(id, status);
        return ResponseEntity.ok(updateNotification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
