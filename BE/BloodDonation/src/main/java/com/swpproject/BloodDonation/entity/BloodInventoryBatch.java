package com.swpproject.BloodDonation.entity;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_inventory_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventoryBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String batchId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodType bloodType;

    // Tổng số lượng máu trong lô (ml)
    @Column(nullable = false)
    private Double totalQuantity;

    // Số lượng máu còn lại (ml)
    @Column(nullable = false)
    private Double remainingQuantity;

    // Ngày nhận lô máu
    private LocalDateTime receivedDate;

    // Hạn sử dụng của lô máu
    private LocalDateTime expiryDate;

    // Trạng thái: ACTIVE, DEPLETED, EXPIRED, DISCARDED
    private String status;

    // Nguồn gốc lô máu
    @Column(columnDefinition = "NVARCHAR(255)")
    private String source;

    // Mã đơn vị/bệnh viện cung cấp (nếu nhận từ bên ngoài)
    private String providerId;

    // Người cập nhật và thời gian
    private String lastUpdatedBy;
    private LocalDateTime lastUpdatedTime;

    // Ghi chú
    @Column(columnDefinition = "NVARCHAR(1000)")
    private String notes;
}