package com.athot.ecommerce_fruits.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.athot.ecommerce_fruits.dto.ReviewRequest;
import com.athot.ecommerce_fruits.dto.ReviewResponse;
import com.athot.ecommerce_fruits.dto.ReviewUpdateRequest;
import com.athot.ecommerce_fruits.model.Product;
import com.athot.ecommerce_fruits.model.Review;
import com.athot.ecommerce_fruits.model.User;
import com.athot.ecommerce_fruits.repository.ProductRepo;
import com.athot.ecommerce_fruits.repository.ReviewRepository;
import com.athot.ecommerce_fruits.repository.UserRepo; 

@Service 
public class ReviewService {
    @Autowired 
    private   ReviewRepository reviewRepository;
    @Autowired 
    private   UserRepo userRepository;
    @Autowired 
    private   ProductRepo productRepository; 
    private User getAuthenticatedUser(Authentication authentication){
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> 
    new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
    // submit a review
    @Transactional 
    public ReviewResponse addReview(
        ReviewRequest request,
        Authentication authentication
    ){
        // this will get the data from the jwt token
        User user = getAuthenticatedUser(authentication);
        Product product = productRepository.findById(request.getProductId())
        .orElseThrow(() -> 
    new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    boolean alreadyReviewed = 
    reviewRepository.existsByUserIdAndProductId(user.getId(), product.getId());
    if(alreadyReviewed){
        throw new ResponseStatusException(
            HttpStatus.CONFLICT, "You have already reviewed the product"
        );
    }

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        // until order verification is  implemented
        review.setVerifiedPurchase(false);
        Review savedReview = reviewRepository.save(review);
        return mapReviewResponse(savedReview);
    
    }

    public ReviewResponse mapReviewResponse(Review review){
         ReviewResponse response = new ReviewResponse(); 
        response.setId(review.getId());
        response.setUserName(review.getUser().getName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setVerfiedPurchase(review.getVerifiedPurchase());
        response.setCreatedAt(review.getCreatedAt());

        return response;
    }


    @Transactional (readOnly = true)
    public List<ReviewResponse> getProductsReview(int productID){
        if(!productRepository.existsById(productID)){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Product not found"
            );
        }

        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productID)
        .stream().map(this::mapReviewResponse).toList();
    }

      // update an existing review
      @Transactional
      public ReviewResponse updateReview(
        Long reviewId,
        ReviewUpdateRequest request,
        Authentication authentication
      ){
        User user = getAuthenticatedUser(authentication);
        Review review = reviewRepository.findById(reviewId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Review not found"
        ));

        // Check review ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot update another user's review");
        }

        // Ensure the review belongs to the same product
        // if (!review.getProduct().getIdEquals(request.getProductId())) {
        //     throw new ResponseStatusException(
        //             HttpStatus.BAD_REQUEST,
        //             "Product cannot be changed");
        // }


        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review updateReview = reviewRepository.save(review);


        return mapReviewResponse(updateReview);
      }

    // delete an existing review
    @Transactional 
    public void deleteReview(Long reviewId, Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        Review review  = reviewRepository.findById(reviewId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Review not found"
        ));


        if(!review.getUser().getId().equals(user.getId())){
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, 
                "You cannot delete another user's review"
            );
        }

        reviewRepository.delete(review);
    }


    // calculate average rating
    @Transactional (readOnly = true)
    public Double getAverageRating(int productID){
        if(!productRepository.existsById(productID)){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Product not found"
            );
        }   

        Double average = reviewRepository.findAverageRatingByProductId(productID);

        return average != null ? average : 0.0;
         } 
        //  get total review
        @Transactional (readOnly = true)
        public long getTotalReview(int productID){
            if(!productRepository.existsById(productID)){
                throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Product not found"
                );
            }

            return reviewRepository.countByProductId(productID);
        }

        
}
