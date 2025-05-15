package com.musichouse.api.music;

import com.musichouse.api.music.config.DotenvInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MusicHouseApplication {
    // carga las variables .env
    private static final Logger LOGGER = LoggerFactory.getLogger(MusicHouseApplication.class);


    public static void main(String[] args) {
        DotenvInitializer.load();
        SpringApplication.run(MusicHouseApplication.class, args);
        LOGGER.info("🎹 Let's hit the keys and start the musical journey with MusicHouseApplication! 🎵🌟");


    }

}
