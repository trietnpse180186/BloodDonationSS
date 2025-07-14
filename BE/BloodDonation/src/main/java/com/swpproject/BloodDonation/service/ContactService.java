package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.ContactRequest;
import com.swpproject.BloodDonation.dto.response.ContactResponse;
import com.swpproject.BloodDonation.entity.Contact;
import com.swpproject.BloodDonation.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

    public ContactResponse create(ContactRequest request){
        Contact contact = new Contact();

        contact.setFullName(request.getFullName());
        contact.setPhoneNumber(request.getPhoneNumber());
        contact.setEmail(request.getEmail());
        contact.setDetails(request.getDetails());

        Contact save = contactRepository.save(contact);
        return new ContactResponse(save.getId(), save.getFullName(), save.getPhoneNumber(), save.getEmail(), save.getDetails());
    }

    @PreAuthorize("hasAuthority('STAFF')")
    public void delete(Long id){
        if(!contactRepository.existsById(id)){
            throw new RuntimeException("Contact not found");
        }
        contactRepository.deleteById(id);
    }

    public void deleteAll() {
        contactRepository.deleteAll();
    }
}
