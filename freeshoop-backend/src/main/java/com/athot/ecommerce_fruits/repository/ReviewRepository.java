package com.athot.ecommerce_fruits.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.athot.ecommerce_fruits.model.Review;

public interface ReviewRepository extends  JpaRepository<Review, Long>{
    List<Review> findByProductIdOrderByCreatedAtDesc(Integer  productId);
    Optional<Review> findByUserIdAndProductId(Long userId, Integer productId);
    boolean existsByUserIdAndProductId(Long userId, Integer productId);
    List<Review> findByUserId(Long userId);
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Integer productId);
    long countByProductId(Integer productId);
}

     
