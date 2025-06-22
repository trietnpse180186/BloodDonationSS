package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.ContactRequest;
import com.swpproject.BloodDonation.dto.response.ContactResponse;
import com.swpproject.BloodDonation.entity.Contact;
import com.swpproject.BloodDonation.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public List<ContactResponse> getAll(){
        return contactRepository.findAll()
                .stream()
                .map(contact -> new ContactResponse(contact.getId(), contact.getFullName(),contact.getPhoneNumber(),contact.getEmail(),contact.getDetails()) )
                .toList();
    }

    
}
