package com.musichouse.api.music.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AwsConfig {

    @Value("${aws.s3.access-key:}")
    private String accessKeyId;

    @Value("${aws.s3.secret-key:}")
    private String accessSecretKey;

    @Value("${aws.s3.region:}")
    private String region;

    @Bean
    public AmazonS3 getS3Client() {
        try {
            if (accessKeyId == null || accessKeyId.isBlank() ||
                    accessSecretKey == null || accessSecretKey.isBlank() ||
                    region == null || region.isBlank()) {
                System.out.println("⚠️ AWS credentials missing or incomplete, AmazonS3 client not created.");
                return null;
            }

            System.out.println("✅ AWS credentials detected, creating AmazonS3 client...");

            BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, accessSecretKey);

            return AmazonS3ClientBuilder.standard()
                    .withRegion(Regions.fromName(region))
                    .withCredentials(new AWSStaticCredentialsProvider(credentials))
                    .build();

        } catch (Exception ex) {
            System.out.println("❌ Error creating AmazonS3 client: " + ex.getMessage());
            return null;
        }
    }
}
