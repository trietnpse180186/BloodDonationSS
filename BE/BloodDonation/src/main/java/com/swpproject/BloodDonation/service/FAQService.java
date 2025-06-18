package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.FAQRequest;
import com.swpproject.BloodDonation.dto.response.BlogResponse;
import com.swpproject.BloodDonation.dto.response.FAQResponse;
import com.swpproject.BloodDonation.entity.FAQ;
import com.swpproject.BloodDonation.repository.FAQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FAQService {
    private final FAQRepository faqRepository;

    public List<FAQResponse> getAll(){
        return faqRepository.findAll()
                .stream()
                .map(faq -> new FAQResponse(faq.getId(), faq.getAnswer(), faq.getQuestion()) )
                .toList();
    }

    public FAQResponse create(FAQRequest faqRequest){
        FAQ faq = new FAQ();
        faq.setQuestion(faqRequest.getQuestion());
        faq.setAnswer(faqRequest.getAnswer());

        FAQ saved = faqRepository.save(faq);
        return new FAQResponse(saved.getId(), saved.getQuestion(), saved.getAnswer());
    }

    public FAQResponse update(Long id, FAQRequest faqRequest){
        FAQ faq = faqRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        faq.setQuestion(faqRequest.getQuestion());
        faq.setAnswer(faqRequest.getAnswer());

        FAQ saved = faqRepository.save(faq);
        return new FAQResponse(saved.getId(), saved.getQuestion(), saved.getAnswer());
    }

    public void delete(Long id){
        if(!faqRepository.existsById(id)){
            throw new RuntimeException("Not Found");
        }
        faqRepository.deleteById(id);
    }
    }
