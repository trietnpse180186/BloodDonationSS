package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.enums.BloodTypeCategory;
import com.swpproject.BloodDonation.enums.EmergencyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO phản hồi thông tin chi tiết yêu cầu hiến máu khẩn cấp
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyBloodResponseDTO {
    private String requestId;
    private String hospitalName;
    private String address;
    private String contactPerson;
    private String contactPhone;
    private String description;
    private BloodType bloodTypeNeeded;
    private BloodTypeCategory bloodTypeCategory; // Phân loại nhóm máu
    private Integer unitsNeeded;
    private Integer unitsDonated;
    private LocalDateTime requestTime;
    private LocalDateTime expirationTime;
    private EmergencyStatus status;
    private boolean isRareBloodType;
    private String priority;
    private List<EmergencyDonorDTO> donors;
    private String createdByName; // Tên người tạo yêu cầu
    private LocalDateTime lastUpdatedTime;
    private String lastUpdatedBy;

    // Thông tin vị trí (nếu có)
    private Double latitude;
    private Double longitude;
    private Double distance; // Khoảng cách từ người dùng đến địa điểm yêu cầu
}