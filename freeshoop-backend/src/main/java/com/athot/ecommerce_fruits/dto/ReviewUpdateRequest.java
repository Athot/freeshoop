package com.athot.ecommerce_fruits.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data 
public class ReviewUpdateRequest {
    @NotNull(message = "Rating is required")
    private Integer rating;
    @NotBlank(message = "Review comment must not be empty")
    @Size (max = 500, message = "Review cannot exceed 500 character")
    private String comment;
}
