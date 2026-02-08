package org.egov.user.domain.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.tracer.model.CustomException;
import org.egov.user.domain.exception.InvalidAccessTokenException;
import org.egov.user.domain.model.SecureUser;
import org.egov.user.domain.model.UserDetail;
import org.egov.user.domain.service.utils.KeycloakTokenValidator;
import org.egov.user.persistence.dto.UserRoleDTO;
import org.egov.user.persistence.repository.ActionRestRepository;
import org.egov.user.security.CustomAuthenticationKeyGenerator;
import org.egov.user.web.contract.auth.User;
import org.egov.user.web.contract.auth.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TokenService {

    @Autowired
    private TokenStore tokenStore;

    private ActionRestRepository actionRestRepository;

    @Value("${roles.state.level.enabled}")
    private boolean isRoleStateLevel;


    @Autowired
    private KeycloakTokenValidator keycloakTokenValidator;

    @Autowired
    private UserService userService;

//    @Autowired
//    private JedisConnectionFactory jedisConnectionFactory;

    @Autowired
    private org.springframework.data.redis.connection.RedisConnectionFactory jedisConnectionFactory;



    @Autowired
    private CustomAuthenticationKeyGenerator authenticationKeyGenerator;

    private TokenService(TokenStore tokenStore, ActionRestRepository actionRestRepository, JwtDecoder jwtDecoder) {
        this.tokenStore = tokenStore;
        this.actionRestRepository = actionRestRepository;
    }

    /**
     * Get UserDetails By AccessToken
     *
     * @param accessToken
     * @return
     */
    public UserDetail getUser(String accessToken) {
        log.info("Received User details Request in getUser Method ");
        if (StringUtils.isEmpty(accessToken)) {
            throw new InvalidAccessTokenException();
        }

        String token = accessToken.trim();

        // 1) JWT path (Keycloak)
        Jwt jwt = null;
        try {
            jwt = keycloakTokenValidator.validate(token);
        }
        catch (JwtException e) {
            throw new CustomException("INVALID_TOKEN", e.getMessage());
        }

        if (jwt != null) {
            log.info("Received JWT Token");
            String username = jwt.getClaimAsString("preferred_username");
            log.info("Received JWT Token user is {}", username);
            log.info("Received JWT Token user subject is {}", jwt.getSubject());
            if (StringUtils.isBlank(username)) {
                username = jwt.getSubject();
                log.info("useranme is : {} ",username);
            }

            // Expiry check (optional if Spring already validates exp)
            Instant exp = jwt.getExpiresAt();
            if (exp != null && Instant.now().isAfter(exp)) {
                log.warn("JWT expired. sub={}, exp={}", jwt.getSubject(), exp);
                throw new CredentialsExpiredException("JWT token expired");
            }

            final String tenantId = jwt.getClaimAsString("tenantId");
            final String userId = jwt.getClaimAsString("userId");
            final String locale = jwt.getClaimAsString("locale");
            final String type = jwt.getClaimAsString("type");

            // Prefer UUID if your user-service stores it. Otherwise use preferred_username / email / phone.

            String sub = jwt.getSubject();
            log.info("sub: {}", sub);
            log.info("JWT claims = {}", jwt.getClaims());
            String uuid = extractUuidFromSub(sub);

            List<UserRoleDTO> dbRoles = userService.getUserRolesByIdentifier(null, username, null, null, tenantId );
            //List<UserRoleDTO> dbRoles = new ArrayList<>();
            Set<Role> roles = Optional.ofNullable(dbRoles)
                    .orElseGet(Collections::emptyList)
                    .stream()
                    .filter(Objects::nonNull)
                    .map(dto -> {
                        Role r = new Role();
                        r.setCode(dto.getCode());
                        r.setName(dto.getName());
                        r.setTenantId(tenantId);
                        return r;
                    })
                    .filter(r -> r.getCode() != null && !r.getCode().isBlank()) // prevents your crash
                    .collect(Collectors.toCollection(HashSet::new));

            log.info("Retrieved roles {}", roles);
            log.info("Role codes: {}", roles.stream().map(Role::getCode).toList());
            log.info("Role Name: {}", roles.stream().map(Role::getCode).toList());
            log.info("Role Tenant: {}", roles.stream().map(Role::getTenantId).toList());

            User u = User.builder()
                        .id(Long.valueOf(userId))
                        .uuid(uuid)
                        .userName(username)
                        .type(type)
                        .emailId(jwt.getClaimAsString("email"))
                        .tenantId(jwt.getClaimAsString("tenantId"))
                        .locale(locale)
                        .mobileNumber(jwt.getClaimAsString("mobileNumber"))
                        .active(true)
                        .roles(roles)
                        .build();

            SecureUser secureUser = new SecureUser(u);
            return new UserDetail(secureUser, null);
        }

        // 2) Legacy path (old Redis token store)
        OAuth2Authentication authentication = tokenStore.readAuthentication(token);

        if (authentication == null) {
            throw new InvalidAccessTokenException();
        }

        SecureUser secureUser = (SecureUser) authentication.getPrincipal();
        return new UserDetail(secureUser, null);
//		String tenantId = null;
//		if (isRoleStateLevel && (secureUser.getTenantId() != null && secureUser.getTenantId().contains(".")))
//			tenantId = secureUser.getTenantId().split("\\.")[0];
//		else
//			tenantId = secureUser.getTenantId();
//
//		List<Action> actions = actionRestRepository.getActionByRoleCodes(secureUser.getRoleCodes(), tenantId);
//		log.info("returning STATE-LEVEL roleactions for tenant: "+tenantId);
//		return new UserDetail(secureUser, actions);
    }

    private static String extractUuidFromSub(String sub) {
        if (sub == null || sub.isBlank()) return null;

        // typical: "f:providerId:uuid" or "uuid"
        int lastColon = sub.lastIndexOf(':');
        if (lastColon >= 0 && lastColon < sub.length() - 1) {
            return sub.substring(lastColon + 1);
        }
        return sub; // fallback when sub is already uuid
    }



    /**
     * Deletes the auth_to_access Redis mapping for a given OAuth2Authentication.
     *
     * @param authentication the authentication object
     */
    public void deleteAuthToAccessKey(OAuth2Authentication authentication) {
        RedisConnection connection = null;
        if (authentication == null) {
            log.warn("Cannot delete auth_to_access key: authentication is null");
            return;
        }

        try {
            // You MUST inject your CustomAuthenticationKeyGenerator as a bean
            String authenticationKey = authenticationKeyGenerator.extractKey(authentication);
            String redisKey = "auth_to_access:" + authenticationKey;
            log.info("Deleting Redis auth_to_access key: {}", redisKey);

            // Select DB 0 (in case your factory is configured differently)
            Long removed;
            try {
                connection = jedisConnectionFactory.getConnection();
                connection.select(0);
                removed = connection.del(redisKey.getBytes());
            } finally {
                if (connection != null) {
                    connection.close();
                }
            }
            log.info("Deleted key '{}'? {}", redisKey, removed == 1);

        } catch (Exception e) {
            log.error("Error while deleting auth_to_access key from Redis", e);
        }
    }


}