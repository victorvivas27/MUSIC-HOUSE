package com.musichouse.api.music.security;

import com.musichouse.api.music.util.RoleConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfigurationSource corsConfigurationSource;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.exceptionHandling(ex ->
                        ex.accessDeniedHandler(accessDeniedHandler))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authRequest -> authRequest
                        /**
                         * Rutas de autenticación y usuarios:
                         * - Registro (POST /api/users/**) es público.
                         * - Acciones administrativas sobre usuarios solo las puede realizar un ADMIN.
                         * - /api/auth/** requiere que el usuario esté autenticado (JWT en cookie).
                         */
                        .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/users/*").authenticated()
                        .requestMatchers("/api/users/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/auth/**").authenticated()

                        /**
                         * Rutas de Temas (/api/themes/**):
                         * - GET público.
                         * - POST, PUT, DELETE, PATCH reservados para usuarios con rol ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/themes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/themes/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/themes/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/themes/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/themes/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de Direcciones y Teléfonos:
                         * - Accesibles solo para usuarios autenticados.
                         */
                        .requestMatchers("/api/address/**").authenticated()
                        .requestMatchers("/api/phones/**").authenticated()

                        /**
                         * Rutas de Categorías (/api/categories/**):
                         * - GET público.
                         * - Modificaciones reservadas para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de Instrumentos (/api/instruments/**):
                         * - GET público.
                         * - CRUD reservado para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/instruments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/instruments/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/instruments/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/instruments/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/instruments/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de Características (/api/characteristic/**)
                         * - GET público.
                         * - CRUD reservado para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/characteristic/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/characteristic/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/characteristic/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/characteristic/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de imágenes (/api/imageurls/**):
                         * - GET público.
                         * - POST y DELETE solo para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/imageurls/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/imageurls/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/imageurls/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de roles:
                         * - Solo accesibles para usuarios ADMIN.
                         */
                        .requestMatchers("/api/roles/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de favoritos:
                         * - Accesibles solo para usuarios autenticados.
                         */
                        .requestMatchers("/api/favorites/**").authenticated()

                        /**
                         * Fechas disponibles:
                         * - GET público (para mostrar disponibilidad).
                         * - POST para usuarios autenticados.
                         * - DELETE reservado para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/available-dates/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/available-dates/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/available-dates/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Rutas de reservas (/api/reservations/**):
                         * - POST y GET accesibles a usuarios autenticados.
                         * - DELETE solo para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/reservations/user/**").hasRole(RoleConstants.USER)
                        .requestMatchers(HttpMethod.POST, "/api/reservations/**").hasRole(RoleConstants.USER)
                        .requestMatchers(HttpMethod.PATCH, "/api/reservations/**").hasRole(RoleConstants.USER)
                        .requestMatchers(HttpMethod.GET, "/api/reservations/**").hasRole(RoleConstants.ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/reservations/**").hasRole(RoleConstants.ADMIN)

                        /**
                         * Política de privacidad:
                         * - GET es público.
                         * - POST reservado para ADMIN.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/privacy-policy/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/privacy-policy/**").hasRole(RoleConstants.ADMIN)

                        .anyRequest().authenticated()
                ).sessionManagement(sessionManager -> sessionManager
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource));
        return http.build();
    }
}
