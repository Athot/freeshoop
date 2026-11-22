package com.athot.ecommerce_fruits.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table(
    name = "reviews",
    uniqueConstraints = {
        @UniqueConstraint (
            name = "uk_user_product_review",
            columnNames = {"user_id", "product_id"}
        )
    }
)
@Data 
@NoArgsConstructor 
@JsonIgnoreProperties ({"hibernateLazyInitializer", "handler"})
public class Review {
    
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    // relationship with the user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // relationship with the product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;
    @Column(nullable = false)
    private Boolean verifiedPurchase = false;
    // date and time should be the current date when the user submit
    @CreationTimestamp 
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp 
    private LocalDateTime upDateAt;
}
