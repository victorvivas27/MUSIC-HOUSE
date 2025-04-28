package com.musichouse.api.music.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.metrics.AwsSdkMetrics;
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
        if (accessKeyId.isBlank() || accessSecretKey.isBlank() || region.isBlank()) {
            System.out.println("AWS credentials missing, skipping S3 client creation.");
            return null; // 🔥 No crea el cliente si falta config
        }

        try {
            // 🔥 Desactivamos AWS Metrics para no romper contenedores Railway
            AwsSdkMetrics.isMetricsEnabled();
        } catch (Exception e) {
            System.out.println("Could not disable AWS SDK Metrics cleanly, continuing...");
        }

        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, accessSecretKey);

        return AmazonS3ClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }
}
