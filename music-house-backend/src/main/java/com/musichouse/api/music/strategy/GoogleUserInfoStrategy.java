package com.musichouse.api.music.strategy;

import com.musichouse.api.music.interfaces.OAuth2UserInfoStrategy;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class GoogleUserInfoStrategy implements OAuth2UserInfoStrategy {
    @Override
    public String getEmail(OAuth2User user, OAuth2AuthenticationToken authToken) {
        return user.getAttribute("email");
    }

    @Override
    public String getName(OAuth2User user) {
        return user.getAttribute("name");
    }

    @Override
    public String getPicture(OAuth2User user) {
        return user.getAttribute("picture");
    }
}
