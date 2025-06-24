package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.ContactRequest;
import com.swpproject.BloodDonation.dto.response.ContactResponse;
import com.swpproject.BloodDonation.entity.Contact;
import com.swpproject.BloodDonation.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    @PreAuthorize("hasAuthority('STAFF')")
    public List<ContactResponse> getAll(){
        return contactRepository.findAll()
                .stream()
                .map(contact -> new ContactResponse(contact.getId(), contact.getFullName(),contact.getPhoneNumber(),contact.getEmail(),contact.getDetails()) )
                .toList();
    }

    public ContactResponse create (ContactRequest request){
        Contact contact = new Contact();
        contact.setFullName(request.getFullName());
        contact.setPhoneNumber(request.getPhoneNumber());
        contact.setEmail(request.getEmail());
        contact.setDetails(request.getDetails());

        Contact saved = contactRepository.save(contact);

        return new ContactResponse(saved.getId(), saved.getFullName(), saved.getPhoneNumber(), saved.getEmail(), saved.getDetails());
    }
}
