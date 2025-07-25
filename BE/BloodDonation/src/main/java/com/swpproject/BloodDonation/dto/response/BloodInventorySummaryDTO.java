package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodInventorySummaryDTO {
    private BloodType bloodType;
    private Double totalQuantity; // Tổng số lượng (ml)
    private Double availableQuantity; // Số lượng còn khả dụng (ml)
    private Integer availableUnits; // Số đơn vị còn khả dụng (1 đơn vị = 350ml)
    private Integer expiringUnits; // Số đơn vị sắp hết hạn (7 ngày)
    private Double usedThisMonth; // Lượng máu đã sử dụng trong tháng
    private Double receivedThisMonth; // Lượng máu đã nhận trong tháng
}