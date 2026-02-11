package org.egov.user.repository.builder;

import org.springframework.stereotype.Component;

@Component
public class RoleQueryBuilder {

    public static final String GET_ROLES_BY_ID_TENANTID = "select roleid,roleidtenantid from eg_userrole where userid=:userId and tenantid=:tenantId";
    public static final String GET_ROLES_BY_ROLEIDS = "select * from eg_role where id in (:id) and tenantid=:tenantId";
    public static final String GET_ROLE_BYTENANT_ANDCODE = "select * from eg_role where code =:code and tenantid=:tenantId";
    public static final String INSERT_USER_ROLES = "insert into eg_userrole_v1(role_code, role_tenantid, user_id, " +
            "user_tenantid, lastmodifieddate) values(:role_code,:role_tenantid,:user_id,:user_tenantid,:lastmodifieddate)";

    public static final String DELETE_USER_ROLES = "delete from eg_userrole_v1 where user_id=:user_id and " +
            "user_tenantid=:user_tenantid";

    public static final String Q_BY_ID =
            "select ur.role_code, ur.role_tenantid " +
                    "from eg_user u join eg_userrole_v1 ur " +
                    "on u.id=ur.user_id and u.tenantid=ur.user_tenantid " +
                    "where u.tenantid=:tenantId and u.id=:userId";

    public static final String Q_BY_UUID =
            "select ur.role_code, ur.role_tenantid " +
                    "from eg_user u join eg_userrole_v1 ur " +
                    "on u.id=ur.user_id and u.tenantid=ur.user_tenantid " +
                    "where u.tenantid=:tenantId and u.uuid=:uuid";

    public static final String Q_BY_USERNAME =
            "select ur.role_code, ur.role_tenantid " +
                    "from eg_user u join eg_userrole_v1 ur " +
                    "on u.id=ur.user_id and u.tenantid=ur.user_tenantid " +
                    "where u.tenantid=:tenantId and u.username=:username";

    public static final String Q_BY_MOBILE =
            "select ur.role_code, ur.role_tenantid " +
                    "from eg_user u join eg_userrole_v1 ur " +
                    "on u.id=ur.user_id and u.tenantid=ur.user_tenantid " +
                    "where u.tenantid=:tenantId and u.mobilenumber=:mobileNumber";
}

