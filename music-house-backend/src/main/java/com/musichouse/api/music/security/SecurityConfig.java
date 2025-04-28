package com.musichouse.api.music.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * hasAnyAuthority:
 * Este método se utiliza para verificar si el usuario actual tiene al menos uno de los permisos especificados en la lista proporcionada.
 * El argumento que recibe es una lista de cadenas que representan los nombres de los permisos.
 * Por ejemplo, hasAnyAuthority('ADMIN', 'USER') verificará si el usuario tiene el permiso ADMIN o USER.
 */

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfigurationSource corsConfigurationSource;

    @Value("${spring.profiles.active:dev}") // 👈 Valor por defecto: dev
    private String activeProfile;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          AuthenticationProvider authenticationProvider,
                          CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationProvider = authenticationProvider;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("🔵 Perfil activo: " + activeProfile); // 👈 DEBUG
        http.csrf(csrf -> csrf.disable());

        if (activeProfile != null && activeProfile.contains("dev")) {  // 👈 no falla aunque no esté exacto
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        } else {
            http.authorizeHttpRequests(authRequest -> authRequest
                            .requestMatchers("/", "/actuator/**").permitAll()
                            .requestMatchers("/api/users/**").permitAll()
                            .requestMatchers("/api/address/**").permitAll()
                            .requestMatchers("/api/phones/**").permitAll()
                            .requestMatchers("/api/themes/**").permitAll()
                            .requestMatchers("/api/categories/**").permitAll()
                            .requestMatchers("/api/instruments/**").permitAll()
                            .requestMatchers("/api/characteristic/**").permitAll()
                            .requestMatchers("/api/imageurls/**").permitAll()
                            .requestMatchers("/api/roles/**").permitAll()
                            .requestMatchers("/api/available-dates/**").permitAll()
                            .requestMatchers("/api/favorites/**").permitAll()
                            .requestMatchers("/api/privacy-policy/**").permitAll()
                            .requestMatchers("/api/reservations/**").permitAll()
                            .anyRequest().authenticated()
                    ).sessionManagement(sessionManager -> sessionManager
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authenticationProvider(authenticationProvider)
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                    .cors(cors -> cors.configurationSource(corsConfigurationSource));
        }
        return http.build();
    }
}
