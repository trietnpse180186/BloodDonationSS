package com.swpproject.BloodDonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userID;

    @Column(unique = true, nullable = false, name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "FullName", nullable = false, columnDefinition = "NVARCHAR(4000)")
    private String fullName;

    @Column(name = "Address", columnDefinition = "NVARCHAR(4000)")
    private String address;

    @Column(name = "Phone_number")
    private String phoneNumber;

    @Column(name = "avatar_url", columnDefinition = "NVARCHAR(1000)")
    private String avatarUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UserHasRole> userHasRoles;

    @Enumerated(EnumType.STRING)
    @Column(name = "Type_Blood")
    private BloodType bloodType;

    @Column(name = "Birthday")
    private LocalDate birthday;

    @Column(name = "Sex")
    private String sex;

    @Column(name = "Occupation", columnDefinition = "NVARCHAR(4000)")
    private String occupation;

    @Column(name = "IsActive")
    private boolean active = true; // Mặc định là đang hoạt động

    // Thông tin vị trí (adding 22/07/2025)
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "location_last_updated")
    private LocalDateTime locationLastUpdated;

    @Column(name = "allow_location_tracking")
    private boolean allowLocationTracking = false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.userHasRoles.stream().map(userHasRole ->
                        new SimpleGrantedAuthority(userHasRole.getRole().getName()))
                .toList();
    }

    @Override
    public String getUsername() {
        return "";
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
