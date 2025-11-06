package com.musichouse.api.music.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AwsConfig {
    @Value("${aws.s3.access-key:}")
    private String accessKeyId;
    @Value("${aws.s3.secret-key:}")
    private String accessSecretKey;
    @Value("${aws.s3.region:}")
    private String region;

    public AmazonS3 createS3Client() {
        if (accessKeyId.isBlank() || accessSecretKey.isBlank() || region.isBlank()) {
            return null;
        }
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, accessSecretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }
}
