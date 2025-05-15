package com.musichouse.api.music.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvInitializer {

    public static void load() {
        Dotenv dotenv = Dotenv.configure()
                .filename(".env")
                .ignoreIfMissing()
                .load();


        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });
    }
}
