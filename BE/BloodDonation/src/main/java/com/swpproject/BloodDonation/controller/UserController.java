package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.UserCreationRequest;
import com.swpproject.BloodDonation.dto.request.UserUpdateRequest;
import com.swpproject.BloodDonation.dto.response.UserCreationResponse;
import com.swpproject.BloodDonation.dto.response.UserDetailResponse;
import com.swpproject.BloodDonation.dto.response.UserUpdateResponse;
import com.swpproject.BloodDonation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/v1/users")
    public UserCreationResponse createUser(@RequestBody UserCreationRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/users/{id}")
    public UserDetailResponse getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/users/{id}")
    public UserUpdateResponse updateById(@PathVariable String id, @RequestBody UserUpdateRequest request){
        return userService.updateUser(id, request);
    }

    @GetMapping("/users")
    public List<UserDetailResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @DeleteMapping("/users/delete/{id}")
    public void deleteAccount(@PathVariable String id){
        userService.deleteUserWithCascade(id);
    }

    @PostMapping("/api/user/avatar")
    public ResponseEntity<String> updateUserAvatar(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        String imageUrl = request.get("imageUrl");

        userService.updateAvatarUrl(id, imageUrl);

        return ResponseEntity.ok("Avatar URL updated successfully.");
    }


}
