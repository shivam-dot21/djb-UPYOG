package org.egov.user.persistence.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.service.utils.EncryptionDecryptionUtil;
import org.egov.user.persistence.dto.UserRoleDTO;
import org.egov.user.repository.builder.RoleQueryBuilder;
import org.egov.user.repository.rowmapper.RoleRowMapper;
import org.egov.user.repository.rowmapper.UserRoleRowMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static java.util.Objects.*;

@Repository
@Slf4j
@Setter
public class RoleRepository {

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private RestTemplate restTemplate;
    private ObjectMapper objectMapper;
    public EncryptionDecryptionUtil encryptionDecryptionUtil;

    @Value("${mdms.roles.filter}")
    private String roleFilter;

    @Value("${mdms.roles.masterName}")
    private String roleMasterName;

    @Value("${mdms.roles.moduleName}")
    private String roleModuleName;

    @Value("${mdms.host}")
    private String host;

    @Value("${mdms.path}")
    private String path;

    public RoleRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, RestTemplate restTemplate,
                          ObjectMapper objectMapper, EncryptionDecryptionUtil encryptionDecryptionUtil) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.encryptionDecryptionUtil = encryptionDecryptionUtil;
    }

    /**
     * Get UserRoles By UserId And TenantId
     *
     * @param userId
     * @param tenantId
     * @return
     */
    public List<Role> getUserRoles(final long userId, final String tenantId) {

        final Map<String, Object> parametersMap = new HashMap<String, Object>();
        parametersMap.put("userId", userId);
        parametersMap.put("tenantId", tenantId);
        List<Role> roleList = namedParameterJdbcTemplate.query(RoleQueryBuilder.GET_ROLES_BY_ID_TENANTID, parametersMap,
                new UserRoleRowMapper());
        List<Long> roleIdList = new ArrayList<Long>();
        String tenantid = null;
        if (!roleList.isEmpty()) {
            for (Role role : roleList) {
                tenantid = role.getTenantId();
            }
        }
        List<Role> roles = new ArrayList<Role>();
        if (!roleIdList.isEmpty()) {

            final Map<String, Object> Map = new HashMap<String, Object>();
            Map.put("id", roleIdList);
            Map.put("tenantId", tenantid);

            roles = namedParameterJdbcTemplate.query(RoleQueryBuilder.GET_ROLES_BY_ROLEIDS, Map, new RoleRowMapper());
        }

        return roles;
    }

    /**
     * Get Role By role code and tenantId
     *
     * @param tenantId
     * @param code
     * @return
     */
    public Role findByTenantIdAndCode(String tenantId, String code) {

        final Map<String, Object> parametersMap = new HashMap<String, Object>();
        parametersMap.put("code", code);
        parametersMap.put("tenantId", tenantId);
        Role role = null;
        List<Role> roleList = namedParameterJdbcTemplate
                .query(RoleQueryBuilder.GET_ROLE_BYTENANT_ANDCODE, parametersMap, new RoleRowMapper());

        if (!roleList.isEmpty()) {
            role = roleList.get(0);
        }
        return role;
    }

    Set<Role> findRolesByCode(Set<String> roles, String tenantId) {

        String url = host + path;
        List<ModuleDetail> moduleDetail = new ArrayList<ModuleDetail>();
        RequestInfo requestInfo = new RequestInfo();
        String roleFilter = getRoleFilter(roles);


        MasterDetail actionsMasterDetail =
                MasterDetail.builder().name(roleMasterName).filter(roleFilter).build();
        moduleDetail.add(ModuleDetail.builder().moduleName(roleModuleName).masterDetails(Collections.singletonList(
                actionsMasterDetail)).build());


        MdmsCriteria mc = new MdmsCriteria();
        mc.setTenantId(tenantId);
        mc.setModuleDetails(moduleDetail);

        MdmsCriteriaReq mcq = new MdmsCriteriaReq();
        mcq.setRequestInfo(requestInfo);
        mcq.setMdmsCriteria(mc);

        JsonNode response = restTemplate.postForObject(url, mcq, JsonNode.class).findValue(roleMasterName);

        Set<Role> validatedRoles = new HashSet<>();

        if (!isNull(response) && response.isArray()) {

            for (JsonNode objNode : response) {
                try {
                    validatedRoles.add(objectMapper.treeToValue(objNode, Role.class));
                } catch (JsonProcessingException e) {
                    log.error("Failed to fetch roles from MDMS", e);
                    throw new CustomException("MDMS_ROLE_FETCH_FAILED", "Unable to fetch roles from MDMS");
                }
            }
        }

        return validatedRoles;
    }

    private String getRoleFilter(Set<String> roleCodes) {
        StringBuilder filter = new StringBuilder();
        Iterator<String> iterator = roleCodes.iterator();


        while (iterator.hasNext()) {
            filter.append("'")
                    .append(iterator.next())
                    .append("'");

            if (iterator.hasNext())
                filter.append(",");
        }

        return roleFilter.replaceAll("\\$code", filter.toString());
    }

    public List<UserRoleDTO> fetchUserRoles(
            Long userId,
            String encryptedUsername,
            String encryptedUuid,
            String encryptedMobile,
            String tenantId) {

        if (tenantId == null || tenantId.isBlank()) {
            throw new IllegalArgumentException("tenantId is mandatory");
        }

        // Choose ONE identifier (priority) to avoid wrong-user matches
        final String sql;
        final Map<String, Object> params = new HashMap<>();
        params.put("tenantId", tenantId);

        if (userId != null) {
            sql = RoleQueryBuilder.Q_BY_ID;
            params.put("userId", userId);

        } else if (encryptedUuid != null && !encryptedUuid.isBlank()) {
            sql = RoleQueryBuilder.Q_BY_UUID;
            params.put("uuid", encryptedUuid);

        } else if (encryptedMobile != null && !encryptedMobile.isBlank()) {
            sql = RoleQueryBuilder.Q_BY_MOBILE;
            params.put("mobileNumber", encryptedMobile);

        } else if (encryptedUsername != null && !encryptedUsername.isBlank()) {
            sql = RoleQueryBuilder.Q_BY_USERNAME;
            params.put("username", encryptedUsername);

        } else {
            // Nothing to search with
            throw new IllegalArgumentException("At least one identifier (userId/uuid/mobile/username) is mandatory");
        }

        log.info("RoleRepository chosen SQL = {}", sql);
        log.info("RoleRepository params: tenantId='{}', userId={}, hasUsername={}, hasMobile={}, hasUuid={}",
                tenantId, userId,
                encryptedUsername != null && !encryptedUsername.isBlank(),
                encryptedMobile != null && !encryptedMobile.isBlank(),
                encryptedUuid != null && !encryptedUuid.isBlank());

        return namedParameterJdbcTemplate.query(sql, params, new UserRoleDTORowMapper());
    }
}
