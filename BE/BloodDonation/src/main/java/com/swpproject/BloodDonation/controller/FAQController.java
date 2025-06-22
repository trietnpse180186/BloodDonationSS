package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.FAQRequest;
import com.swpproject.BloodDonation.dto.response.FAQResponse;
import com.swpproject.BloodDonation.entity.FAQ;
import com.swpproject.BloodDonation.service.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq")
@CrossOrigin
@RequiredArgsConstructor
public class FAQController {

    private final FAQService faqService;

    @GetMapping
    public List<FAQResponse> getAllFAQ(){
        return faqService.getAll();
    }

    @PostMapping
    public FAQResponse createFAQ(@RequestBody FAQRequest faqRequest){
        return faqService.create(faqRequest);
    }

    @PutMapping("/{id}")
    public FAQResponse updateFAQ(@PathVariable Long id, @RequestBody FAQRequest faqRequest){
        return faqService.update(id, faqRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteFAQ(@PathVariable Long id){
        faqService.delete(id);
    }
}
