package com.swpproject.BloodDonation.config;

import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
public class EnumConverterConfiguration {

    @Bean
    public GlobalOpenApiCustomizer customizeGlobalOpenApiEnums() {
        return openApi -> {
            // Tùy chỉnh hiển thị cho tất cả các schema là enum
            openApi.getComponents().getSchemas().values().stream()
                    .filter(schema -> schema.getEnum() != null && !schema.getEnum().isEmpty())
                    .forEach(schema -> {
                        Map<String, Object> extensions = new HashMap<>();
                        extensions.put("x-enumNames", schema.getEnum());
                        schema.setExtensions(extensions);

                        // Bổ sung mô tả với các giá trị enum
                        String enumDescription = Stream.of(schema.getEnum())
                                .map(String::valueOf)
                                .collect(Collectors.joining(", ", "Possible values: ", ""));
                        if (schema.getDescription() == null) {
                            schema.setDescription(enumDescription);
                        } else {
                            schema.setDescription(schema.getDescription() + ". " + enumDescription);
                        }
                    });
        };
    }
}