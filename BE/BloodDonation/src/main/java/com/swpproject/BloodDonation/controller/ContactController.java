package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.ContactRequest;
import com.swpproject.BloodDonation.dto.response.ContactResponse;
import com.swpproject.BloodDonation.entity.Contact;
import com.swpproject.BloodDonation.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;


    @GetMapping
    public List<ContactResponse> getAllContact (){
        return contactService.getAll();
    }

    @PostMapping
    public ContactResponse createContact (@RequestBody ContactRequest request){
        return contactService.create(request);
    }
}
