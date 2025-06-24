package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.BlogRequest;
import com.swpproject.BloodDonation.dto.response.BlogResponse;
import com.swpproject.BloodDonation.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blogs")
@CrossOrigin
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public List<BlogResponse> getAllBlogs(){
        return blogService.getAll();
    }

    @PostMapping
    public BlogResponse create(@RequestBody BlogRequest blogRequest) {
        return blogService.create(blogRequest);
    }

    @PutMapping("/{id}")
    public BlogResponse update(@PathVariable Long id, @RequestBody BlogRequest blogRequest) {
        return blogService.update(id, blogRequest);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        blogService.delete(id);
    }
}
