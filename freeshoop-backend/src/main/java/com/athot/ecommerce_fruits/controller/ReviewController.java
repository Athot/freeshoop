package com.athot.ecommerce_fruits.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.athot.ecommerce_fruits.dto.ReviewRequest;
import com.athot.ecommerce_fruits.dto.ReviewResponse;
import com.athot.ecommerce_fruits.dto.ReviewUpdateRequest;
import com.athot.ecommerce_fruits.service.ReviewService;

import jakarta.validation.Valid; 

@RestController 
@RequestMapping("/api/reviews") 
public class ReviewController {
    @Autowired 
    private   ReviewService reviewService;

    // submit the review
    @PostMapping
    public ReviewResponse addReview(
        @Valid  @RequestBody ReviewRequest request,
        Authentication authentication
    ){
        return  reviewService.addReview(request, authentication);

         }

// get all the reviews for a product

    @GetMapping("/product/{productId}") 
    public List<ReviewResponse> getProductReview(  @PathVariable Integer productId){
       
        return reviewService.getProductsReview(productId);
      
    }

    // update the ratings
    @PutMapping("/{reviewID}")
        public ReviewResponse updateReview(
            @PathVariable Long reviewID,
            @Valid @RequestBody ReviewUpdateRequest request,
            Authentication authentication
        ){  
            return reviewService.updateReview(reviewID, request, authentication);
        }
    

    @DeleteMapping("/{reviewID}")
    public void  deleteReview(
        @PathVariable Long reviewID,
         Authentication authentication
    ){
        reviewService.deleteReview(reviewID, authentication);
    }


    @GetMapping("/getAvgRating/{productID}")
    public Double getAverageRating(
        @PathVariable int productID
    )
{
 return    reviewService.getAverageRating(productID);
}
  
}
