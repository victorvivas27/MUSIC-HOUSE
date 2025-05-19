package com.musichouse.api.music.strategy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.interfaces.OAuth2UserInfoStrategy;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

public class GithubUserInfoStrategy implements OAuth2UserInfoStrategy {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public GithubUserInfoStrategy(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public String getEmail(OAuth2User user, OAuth2AuthenticationToken authToken) {
        String email = user.getAttribute("email");
        if (email != null) return email;

        try {
            OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                    authToken.getAuthorizedClientRegistrationId(),
                    authToken.getName()
            );

            String accessToken = authorizedClient.getAccessToken().getTokenValue();
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user/emails"))
                    .header("Authorization", "Bearer " + accessToken)
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                List<Map<String, Object>> emails = mapper.readValue(response.body(), List.class);
                for (Map<String, Object> emailEntry : emails) {
                    if (Boolean.TRUE.equals(emailEntry.get("primary")) &&
                            Boolean.TRUE.equals(emailEntry.get("verified"))) {
                        return (String) emailEntry.get("email");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String getName(OAuth2User user) {
        String name = user.getAttribute("name");
        return (name != null && !name.isBlank()) ? name : user.getAttribute("login");
    }

    @Override
    public String getPicture(OAuth2User user) {
        return user.getAttribute("avatar_url");
    }
}
