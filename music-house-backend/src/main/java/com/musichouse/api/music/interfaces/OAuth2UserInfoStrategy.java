package com.musichouse.api.music.interfaces;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuth2UserInfoStrategy {
    String getEmail(OAuth2User user, OAuth2AuthenticationToken authToken);

    String getName(OAuth2User user);

    String getPicture(OAuth2User user);
}
