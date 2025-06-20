package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.FAQRequest;
import com.swpproject.BloodDonation.dto.response.FAQResponse;
import com.swpproject.BloodDonation.entity.FAQ;
import com.swpproject.BloodDonation.service.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq")
@CrossOrigin
@RequiredArgsConstructor
public class FAQController {

    private final FAQService faqService;

    @GetMapping
    //@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public List<FAQResponse> getAllFAQ(){
        return faqService.getAll();
    }

    @PostMapping
    //@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public FAQResponse createFAQ(@RequestBody FAQRequest faqRequest){
        return faqService.create(faqRequest);
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public FAQResponse updateFAQ(@PathVariable Long id, @RequestBody FAQRequest faqRequest){
        return faqService.update(id, faqRequest);
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public void deleteFAQ(@PathVariable Long id){
        faqService.delete(id);
    }
}
