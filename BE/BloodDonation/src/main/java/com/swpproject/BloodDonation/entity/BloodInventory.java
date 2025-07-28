package com.swpproject.BloodDonation.entity;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodType bloodType;

    // Số lượng máu tính bằng ml
    @Column(nullable = false)
    private Double quantity;

    // Thời gian nhận máu vào kho
    private LocalDateTime receivedDate;

    // Thời hạn sử dụng của đơn vị máu (thông thường 35-42 ngày)
    private LocalDateTime expiryDate;

    // Mô tả về nguồn máu (hiến thường xuyên, hiến khẩn cấp...)
    @Column(columnDefinition = "NVARCHAR(255)")
    private String source;

    // ID của lịch hiến máu hoặc yêu cầu khẩn cấp nếu có
    private String donationId;

    // ID của người hiến máu
    private String donorId;

    // Trạng thái: AVAILABLE, USED, EXPIRED, DISCARDED
    private String status;

    // Ghi chú bổ sung
    @Column(columnDefinition = "NVARCHAR(1000)")
    private String notes;

    @Column
    private Double usedQuantity; // Lưu lượng máu đã được sử dụng

    // Người cập nhật và thời gian
    private String lastUpdatedBy;
    private LocalDateTime lastUpdatedTime;
}