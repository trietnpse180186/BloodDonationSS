package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.BlogRequest;
import com.swpproject.BloodDonation.dto.response.BlogResponse;
import com.swpproject.BloodDonation.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/{id}/image")
    public ResponseEntity<String> updateBlogImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String imageUrl = request.get("imageUrl");

        blogService.updateImageUrl(id, imageUrl);

        return ResponseEntity.ok("Image URL updated successfully.");
    }

}
