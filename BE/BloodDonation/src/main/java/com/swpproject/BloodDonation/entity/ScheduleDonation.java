package com.swpproject.BloodDonation.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ScheduleDonation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDonation {

    @Id
    private String scheduleId;

    @Column(name = "Date")
    private LocalDate date;

    @Column(name = "Address", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "NumberOfDonor")
    private Integer numberOfDonor;

    @Column(name = "UpdateBy")
    private String updateBy;

    @OneToMany(mappedBy = "scheduleDonation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<TimeSlot> timeSlots = new ArrayList<>();

    public void addTimeSlot(TimeSlot timeSlot) {
        timeSlots.add(timeSlot);
        timeSlot.setScheduleDonation(this);
    }

    public void removeTimeSlot(TimeSlot timeSlot) {
        timeSlots.remove(timeSlot);
        timeSlot.setScheduleDonation(null);
    }
}