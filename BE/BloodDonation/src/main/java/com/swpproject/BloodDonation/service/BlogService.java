package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.BlogRequest;
import com.swpproject.BloodDonation.dto.response.BlogResponse;
import com.swpproject.BloodDonation.entity.Blog;
import com.swpproject.BloodDonation.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    public List<BlogResponse> getAll(){
        return blogRepository.findAll()
                .stream()
                .map(blog -> new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getImageurl()) )
                .toList();
    }

    public BlogResponse create(BlogRequest blogRequest) {
        Blog blog = new Blog();
        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        blog.setImageurl(blogRequest.getImageurl());

        Blog saved = blogRepository.save(blog);
        return new BlogResponse(saved.getId(), saved.getTitle(), saved.getContent(), saved.getImageurl());
    }

    public BlogResponse update(Long id, BlogRequest blogRequest) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        blog.setTitle(blogRequest.getTitle());
        blog.setContent(blogRequest.getContent());
        blog.setImageurl(blogRequest.getImageurl());

        Blog updated = blogRepository.save(blog);
        return new BlogResponse(updated.getId(), updated.getTitle(), updated.getContent(), updated.getImageurl());
    }

    public void delete(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new RuntimeException("Not found.");
        }
        blogRepository.deleteById(id);
    }
}

