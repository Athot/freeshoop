package main.java.com.athot.ecommerce_fruits.config;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    // dkiccytp6
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    // 423996194298761
    @Value("${cloudinary.api-key}")
    private String apiKey;
    
    // 36ftXLRcep3EFT3D-v5OHbzyb2g
    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {

        return new Cloudinary(
            ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
            )
        );
    }
}
