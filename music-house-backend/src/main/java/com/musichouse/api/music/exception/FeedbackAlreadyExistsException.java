package com.musichouse.api.music.exception;

public class FeedbackAlreadyExistsException extends RuntimeException {
    public FeedbackAlreadyExistsException(String message) {
        super(message);
    }
}
