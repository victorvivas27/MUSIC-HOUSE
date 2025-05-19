package com.musichouse.api.music.strategy;

import com.musichouse.api.music.interfaces.OAuth2UserInfoStrategy;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Component;

@Component
public class OAuth2UserInfoStrategyFactory {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2UserInfoStrategyFactory(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    public OAuth2UserInfoStrategy getStrategy(String provider) {
        return switch (provider) {
            case "google" -> new GoogleUserInfoStrategy();
            case "github" -> new GithubUserInfoStrategy(authorizedClientService);
            default -> throw new IllegalArgumentException("Proveedor no soportado: " + provider);
        };
    }
}