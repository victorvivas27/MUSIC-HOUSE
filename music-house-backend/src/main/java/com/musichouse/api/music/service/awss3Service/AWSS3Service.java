package com.musichouse.api.music.service.awss3Service;

import com.amazonaws.services.s3.AmazonS3;
import com.musichouse.api.music.config.AwsConfig;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.interfaces.AWSS3Interface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class AWSS3Service implements AWSS3Interface {

    private static final Logger LOGGER = LoggerFactory.getLogger(AWSS3Service.class);

    private final AwsConfig awsConfig;
    private final S3UploadHelper s3UploadHelper;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public AWSS3Service(AwsConfig awsConfig, S3UploadHelper s3UploadHelper) {
        this.awsConfig = awsConfig;
        this.s3UploadHelper = s3UploadHelper;
    }

    private AmazonS3 getS3Client() {
        AmazonS3 client = awsConfig.createS3Client();
        if (client == null) {
            throw new IllegalStateException("Amazon S3 Client not available!");
        }
        return client;
    }

    public String copyDefaultUserImage(UUID idUser) {
        AmazonS3 amazonS3 = getS3Client();

        String sourceKey = "usuarios/default/default.png";
        String destinationKey = "usuarios/" + idUser + "/default.png";

        amazonS3.copyObject(bucketName, sourceKey, bucketName, destinationKey);

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + destinationKey;
    }

    public String uploadFileToS3User(MultipartFile file, UUID idUser) {
        return s3UploadHelper.uploadSingleFile(file, "usuarios/" + idUser);
    }

    public String uploadUserModifyFileToS3(MultipartFile file, UserDtoModify userDtoModify) {
        return s3UploadHelper.uploadSingleFile(file, "usuarios/" + userDtoModify.getIdUser());
    }

    public List<String> uploadFilesToS3Instrument(List<MultipartFile> files, UUID idInstrument) {
        return s3UploadHelper.uploadMultipleFiles(files, "instruments/" + idInstrument);
    }

    public String uploadToS3Theme(MultipartFile file, UUID idTheme) {
        return s3UploadHelper.uploadSingleFile(file, "theme/" + idTheme);
    }

    public String uploadSingleFile(MultipartFile file, String folder) {
        return s3UploadHelper.uploadSingleFile(file, folder);
    }
}


