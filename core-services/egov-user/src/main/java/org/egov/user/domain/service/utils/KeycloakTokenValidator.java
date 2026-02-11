package org.egov.user.domain.service.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class KeycloakTokenValidator {

    private final JwtDecoder decoder;

    public KeycloakTokenValidator(
            @Value("${keycloak.jwks-url}") String jwksUrl,
            @Value("${keycloak.issuer}") String issuer,
            @Value("${keycloak.audience:}") String audience // optional
    ) {
        NimbusJwtDecoder nimbus = NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuer);

        if (audience != null && !audience.isBlank()) {
            OAuth2TokenValidator<Jwt> withAudience = new AudienceValidator(audience);
            nimbus.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience));
        } else {
            nimbus.setJwtValidator(withIssuer);
        }

        this.decoder = nimbus;
    }

    public Jwt validate(String token) throws JwtException {
        return decoder.decode(token);
    }

    static class AudienceValidator implements OAuth2TokenValidator<Jwt> {
        private final String audience;
        AudienceValidator(String audience) { this.audience = audience; }

        @Override
        public OAuth2TokenValidatorResult validate(Jwt jwt) {
            List<String> aud = jwt.getAudience();
            if (aud != null && aud.contains(audience)) return OAuth2TokenValidatorResult.success();
            return OAuth2TokenValidatorResult.failure(new OAuth2Error(
                    "invalid_token", "Missing required audience: " + audience, null));
        }
    }
}
