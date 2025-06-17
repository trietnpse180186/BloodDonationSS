package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.UserCreationRequest;
import com.swpproject.BloodDonation.dto.response.UserCreationResponse;
import com.swpproject.BloodDonation.dto.response.UserDetailResponse;
import com.swpproject.BloodDonation.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/users")
    public List<UserDetailResponse> getAllUsers(){
        return userService.getAllUsers();
    }

}
