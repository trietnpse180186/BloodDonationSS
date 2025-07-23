package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.LocationUpdateDTO;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý vị trí người dùng
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserLocationService {

    private final UserRepository userRepository;

    /**
     * Cập nhật vị trí của người dùng
     */
    @Transactional
    public void updateUserLocation(String userId, LocationUpdateDTO locationDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setLatitude(locationDTO.getLatitude());
        user.setLongitude(locationDTO.getLongitude());
        user.setLocationLastUpdated(LocalDateTime.now());

        if (locationDTO.getAllowLocationTracking() != null) {
            user.setAllowLocationTracking(locationDTO.getAllowLocationTracking());
        }

        userRepository.save(user);
        log.info("Đã cập nhật vị trí cho người dùng: {}", userId);
    }

    /**
     * Kiểm tra xem người dùng có bật theo dõi vị trí hay không
     */
    public boolean isLocationTrackingEnabled(String userId) {
        return userRepository.findById(userId)
                .map(User::isAllowLocationTracking)
                .orElse(false);
    }

    /**
     * Bật/tắt theo dõi vị trí
     */
    @Transactional
    public void setLocationTrackingEnabled(String userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setAllowLocationTracking(enabled);
        userRepository.save(user);
        log.info("Đã {} theo dõi vị trí cho người dùng: {}", enabled ? "bật" : "tắt", userId);
    }

    /**
     * Tìm kiếm người dùng trong phạm vi bán kính (km) từ một vị trí
     * @param latitude Vĩ độ trung tâm
     * @param longitude Kinh độ trung tâm
     * @param radiusKm Bán kính tìm kiếm (km)
     * @param bloodType Nhóm máu (có thể null)
     * @return Danh sách người dùng trong phạm vi
     */
    public List<User> findNearbyUsers(double latitude, double longitude, double radiusKm, String bloodType) {
        // Tìm tất cả người dùng đã bật theo dõi vị trí và có tọa độ
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.isAllowLocationTracking() && user.isActive())
                .filter(user -> user.getLatitude() != null && user.getLongitude() != null)
                .filter(user -> {
                    // Nếu bloodType được chỉ định, chỉ lấy người dùng có nhóm máu phù hợp
                    return bloodType == null ||
                            user.getBloodType() != null &&
                                    user.getBloodType().toString().equals(bloodType);
                })
                .filter(user -> calculateDistance(latitude, longitude,
                        user.getLatitude(), user.getLongitude()) <= radiusKm)
                .collect(Collectors.toList());

        // Sắp xếp theo khoảng cách gần nhất
        users.sort((u1, u2) -> {
            double dist1 = calculateDistance(latitude, longitude, u1.getLatitude(), u1.getLongitude());
            double dist2 = calculateDistance(latitude, longitude, u2.getLatitude(), u2.getLongitude());
            return Double.compare(dist1, dist2);
        });

        return users;
    }

    /**
     * Tính khoảng cách giữa hai điểm theo công thức Haversine
     * @return Khoảng cách tính bằng km
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Bán kính trái đất (km)

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}