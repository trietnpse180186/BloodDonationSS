package com.swpproject.BloodDonation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Cấu hình Async cho các tác vụ xử lý bất đồng bộ
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {
    // Cấu hình mặc định của Spring Boot đã đủ
}