package com.musichouse.api.music.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class TelegramBotInitializer {

   /* @Bean
    public CommandLineRunner registerTelegramBot(MyTelegramBot myTelegramBot) {
        return args -> {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            try {
                botsApi.registerBot(myTelegramBot);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        };
    }*/
}
