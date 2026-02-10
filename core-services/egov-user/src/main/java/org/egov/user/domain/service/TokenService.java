package org.egov.user.domain.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.user.domain.exception.InvalidAccessTokenException;
import org.egov.user.domain.model.Action;
import org.egov.user.domain.model.SecureUser;
import org.egov.user.domain.model.UserDetail;
import org.egov.user.domain.service.UserService;
import org.egov.user.domain.service.utils.KeycloakTokenValidator;
import org.egov.user.persistence.dto.UserRoleDTO;
import org.egov.user.persistence.repository.ActionRestRepository;
import org.egov.user.web.contract.auth.Role;
import org.egov.user.web.contract.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.stereotype.Service;

// REMOVED DEPRECATED IMPORTS:
// import org.springframework.security.oauth2.provider.OAuth2Authentication;
// import org.springframework.security.oauth2.provider.token.TokenStore;

@Service
@Slf4j
public class TokenService {

    // CHANGED: TokenStore -> OAuth2AuthorizationService
    private OAuth2AuthorizationService authorizationService;
    private ActionRestRepository actionRestRepository;
    private UserService userService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private KeycloakTokenValidator keycloakTokenValidator;

    @Value("${roles.state.level.enabled}")
    private boolean isRoleStateLevel;

    // UPDATED CONSTRUCTOR
    private TokenService(OAuth2AuthorizationService authorizationService,
                        ActionRestRepository actionRestRepository,
                        UserService userService) {
        this.authorizationService = authorizationService;
        this.actionRestRepository = actionRestRepository;
        this.userService = userService;
    }

    /**
     * Get UserDetails By AccessToken
     *
     * @param accessToken
     * @return
     */
//    public UserDetail getUser(String accessToken) {
//        if (StringUtils.isEmpty(accessToken)) {
//            throw new InvalidAccessTokenException();
//        }
//
//        // Try OAuth2AuthorizationService first (for JWT tokens)
//        OAuth2Authorization authorization = authorizationService.findByToken(accessToken, OAuth2TokenType.ACCESS_TOKEN);
//
//        if (authorization != null) {
//            // JWT token path - extract SecureUser from OAuth2Authorization
//            Authentication authentication = authorization.getAttribute(Authentication.class.getName());
//            if (authentication != null && authentication.getPrincipal() instanceof SecureUser) {
//                SecureUser secureUser = (SecureUser) authentication.getPrincipal();
//                return new UserDetail(secureUser, null);
//            }
//        }
//
//        // Opaque token path - get token metadata directly from Redis
//        UserDetail userDetail = getUserFromOpaqueToken(accessToken);
//
//        // Add action resolution to prevent null pointer errors in other services
//        if (userDetail != null && userDetail.getSecureUser() != null) {
//            SecureUser secureUser = userDetail.getSecureUser();
//
//            String tenantId = null;
//            if (isRoleStateLevel && (secureUser.getTenantId() != null && secureUser.getTenantId().contains(".")))
//                tenantId = secureUser.getTenantId().split("\\.")[0];
//            else
//                tenantId = secureUser.getTenantId();
//
//            // Create RequestInfo with authToken for access-control authentication
//            // This ensures external access-control services can authenticate the request
//            org.egov.common.contract.request.RequestInfo requestInfo =
//                org.egov.common.contract.request.RequestInfo.builder()
//                    .apiId("egov-user")
//                    .ver("1.0")
//                    .ts(System.currentTimeMillis())
//                    .msgId("egov-user-" + System.currentTimeMillis())
//                    .authToken(accessToken)  // Include token for access-control authentication
//                    .build();
//
//            List<Action> actions = actionRestRepository.getActionByRoleCodes(secureUser.getRoleCodes(), tenantId, requestInfo);
//            log.info("returning STATE-LEVEL roleactions for tenant: " + tenantId);
//            return new UserDetail(secureUser, actions);
//        }
//
//        return userDetail;
//    }
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
//        UserDetail userDetail = getUserFromOpaqueToken(token);

        // 1) JWT path (Keycloak)
        Jwt jwt = null;
        try {
            jwt = keycloakTokenValidator.validate(token);
        } catch (JwtException e) {
            throw new CustomException("INVALID_TOKEN", e.getMessage());
        }

        if (jwt != null) {
            log.info("Received JWT Token");
            String username = jwt.getClaimAsString("preferred_username");
            log.info("Received JWT Token user is {}", username);
            log.info("Received JWT Token user subject is {}", jwt.getSubject());
            if (StringUtils.isBlank(username)) {
                username = jwt.getSubject();
                log.info("useranme is : {} ", username);
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

            List<UserRoleDTO> dbRoles = userService.getUserRolesByIdentifier(null, username, null, null, tenantId);
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
        return null;
    }

    // Method to fetch the uuid form Subject
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
     * Get UserDetails from opaque token stored in Redis
     * 
     * @param accessToken
     * @return UserDetail
     */
    @SuppressWarnings("unchecked")
    private UserDetail getUserFromOpaqueToken(String accessToken) {
        String tokenKey = "access_token:" + accessToken;
        Map<String, Object> tokenMetadata = (Map<String, Object>) redisTemplate.opsForValue().get(tokenKey);
        
        if (tokenMetadata == null) {
            log.error("Token metadata not found in Redis for token: {}", accessToken.substring(0, Math.min(8, accessToken.length())) + "...");
            throw new InvalidAccessTokenException();
        }
        
        // Extract user information from token metadata
        Map<String, Object> userRequest = (Map<String, Object>) tokenMetadata.get("UserRequest");
        if (userRequest == null) {
            log.error("UserRequest not found in token metadata for token: {}", accessToken.substring(0, Math.min(8, accessToken.length())) + "...");
            throw new InvalidAccessTokenException();
        }
        
        // Convert to User contract object
        Object idObj = userRequest.get("id");
        Long userId = idObj instanceof Integer ? ((Integer) idObj).longValue() : (Long) idObj;
        
        User user = User.builder()
            .id(userId)
            .uuid((String) userRequest.get("uuid"))
            .userName((String) userRequest.get("userName"))
            .name((String) userRequest.get("name"))
            .mobileNumber((String) userRequest.get("mobileNumber"))
            .emailId((String) userRequest.get("emailId"))
            .locale((String) userRequest.get("locale"))
            .type((String) userRequest.get("type"))
            .tenantId((String) userRequest.get("tenantId"))
            .active((Boolean) userRequest.get("active"))
            .roles(extractRolesFromUserRequest(userRequest)) // Extract roles from token metadata
            .build();
        
        // Create SecureUser from the User object
        SecureUser secureUser = new SecureUser(user);
        log.info("BEFORE DECRYPTION: User {} has {} roles", user.getId(),
            user.getRoles() != null ? user.getRoles().size() : "NULL");

        // Decrypt user data using the same logic as /user/oauth/token and /user/_search
        try {
            log.info("Starting user decryption for opaque token. User: {}, encrypted userName: {}",
                user.getId(), user.getUserName());

            // Convert contract user to domain user for decryption
            org.egov.user.domain.model.User domainUser = convertContractToDomainUser(user);
            log.info("Converted to domain user, calling decryptUserWithContext");
            log.info("DomainUser has {} roles",
                domainUser.getRoles() != null ? domainUser.getRoles().size() : "NULL");

            // Decrypt user with proper authenticated context
            org.egov.user.domain.model.User decryptedDomainUser = userService.decryptUserWithContext(domainUser, user);
            log.info("Decryption completed, converting back to contract user");
            log.info("DecryptedDomainUser has {} roles",
                decryptedDomainUser.getRoles() != null ? decryptedDomainUser.getRoles().size() : "NULL");

            // Convert back to contract user and create new SecureUser
            User decryptedUser = convertToContractUser(decryptedDomainUser);
            log.info("DecryptedUser (contract) has {} roles",
                decryptedUser.getRoles() != null ? decryptedUser.getRoles().size() : "NULL");

            secureUser = new SecureUser(decryptedUser);
            log.info("Opaque token using decrypted user data. Decrypted userName: {}, roles: {}",
                decryptedUser.getUserName(), decryptedUser.getRoles() != null ? decryptedUser.getRoles().size() : "NULL");
        } catch (Exception e) {
            log.error("Failed to decrypt user for opaque token: {}", e.getMessage(), e);
            log.info("Falling back to encrypted user data for opaque token");
            // Continue with encrypted user data - secureUser already created above
        }

        log.info("FINAL: Successfully retrieved user from opaque token: userId={}, userName={}, roles={}",
            user.getId(), user.getUserName(),
            secureUser.getUser().getRoles() != null ? secureUser.getUser().getRoles().size() : "NULL");
        return new UserDetail(secureUser, null);
    }

    /**
     * Convert contract User to domain User for decryption
     */
    private org.egov.user.domain.model.User convertContractToDomainUser(User contractUser) {
        if (contractUser == null) {
            return null;
        }

        return org.egov.user.domain.model.User.builder()
            .id(contractUser.getId())
            .uuid(contractUser.getUuid())
            .username(contractUser.getUserName())
            .name(contractUser.getName())
            .mobileNumber(contractUser.getMobileNumber())
            .emailId(contractUser.getEmailId())
            .locale(contractUser.getLocale())
            .active(contractUser.isActive())
            .type(contractUser.getType() != null ?
                org.egov.user.domain.model.enums.UserType.fromValue(contractUser.getType()) : null)
            .tenantId(contractUser.getTenantId())
            .roles(contractUser.getRoles() != null ?
                contractUser.getRoles().stream()
                    .map(role -> org.egov.user.domain.model.Role.builder()
                        .name(role.getName())
                        .code(role.getCode())
                        .tenantId(role.getTenantId())
                        .build())
                    .collect(Collectors.toSet()) : new HashSet<>()) // CRITICAL FIX: Never return null roles
            .build();
    }

    /**
     * Convert domain User to contract User
     */
    private User convertToContractUser(org.egov.user.domain.model.User domainUser) {
        if (domainUser == null) {
            return null;
        }

        return User.builder()
            .id(domainUser.getId())
            .uuid(domainUser.getUuid())
            .userName(domainUser.getUsername())
            .name(domainUser.getName())
            .mobileNumber(domainUser.getMobileNumber())
            .emailId(domainUser.getEmailId())
            .locale(domainUser.getLocale())
            .active(domainUser.getActive())
            .type(domainUser.getType() != null ? domainUser.getType().name() : null)
            .tenantId(domainUser.getTenantId())
            .roles(domainUser.getRoles() != null ?
                domainUser.getRoles().stream()
                    .map(role -> new org.egov.user.web.contract.auth.Role(role))
                    .collect(Collectors.toSet()) : new HashSet<>()) // Ensure empty set instead of null
            .build();
    }

    /**
     * Extract roles from UserRequest metadata for opaque tokens
     * Handles both Set and List formats from Redis deserialization
     */
    @SuppressWarnings("unchecked")
    private HashSet<org.egov.user.web.contract.auth.Role> extractRolesFromUserRequest(Map<String, Object> userRequest) {
        Object rolesObj = userRequest.get("roles");

        if (rolesObj == null) {
            log.warn("ROLE EXTRACTION: roles field is null in token metadata");
            return new HashSet<>();
        }

        log.debug("ROLE EXTRACTION: rolesObj type = {}", rolesObj.getClass().getName());

        try {
            // Handle Collection (Set or List) of role objects
            if (rolesObj instanceof java.util.Collection) {
                java.util.Collection<?> rolesCollection = (java.util.Collection<?>) rolesObj;

                log.info("ROLE EXTRACTION: Found {} roles in token metadata", rolesCollection.size());

                HashSet<org.egov.user.web.contract.auth.Role> roles = rolesCollection.stream()
                    .map(roleItem -> {
                        try {
                            if (roleItem instanceof Map) {
                                // Handle Map representation (from Redis JSON deserialization)
                                Map<String, Object> roleMap = (Map<String, Object>) roleItem;
                                // CRITICAL FIX: Constructor parameter order is (name, code, tenantId)
                                // NOT (code, name, tenantId) - this was causing role codes and names to be swapped!
                                return new org.egov.user.web.contract.auth.Role(
                                    (String) roleMap.get("name"),     // First param = name
                                    (String) roleMap.get("code"),     // Second param = code
                                    (String) roleMap.get("tenantId")
                                );
                            } else if (roleItem instanceof org.egov.user.web.contract.auth.Role) {
                                // Handle direct Role object (if Redis preserves object type)
                                return (org.egov.user.web.contract.auth.Role) roleItem;
                            } else {
                                log.warn("ROLE EXTRACTION: Unexpected role item type: {}", roleItem.getClass().getName());
                                return null;
                            }
                        } catch (Exception e) {
                            log.error("ROLE EXTRACTION: Failed to convert role item: {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(role -> role != null)
                    .collect(Collectors.toCollection(HashSet::new));

                log.info("ROLE EXTRACTION: Successfully extracted {} roles", roles.size());
                return roles;
            } else {
                log.warn("ROLE EXTRACTION: rolesObj is not a Collection, type = {}", rolesObj.getClass().getName());
            }
        } catch (Exception e) {
            log.error("ROLE EXTRACTION: Failed to extract roles from token metadata", e);
        }

        log.warn("ROLE EXTRACTION: Returning empty roles set");
        return new HashSet<>();
    }
}