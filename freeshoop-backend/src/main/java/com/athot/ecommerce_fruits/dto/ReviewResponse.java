package com.athot.ecommerce_fruits.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data 
public class ReviewResponse {
    private Long id;
    private String userName;
    private Integer rating;
    private String comment;
    private Boolean verfiedPurchase; 
    private LocalDateTime createdAt;
}
