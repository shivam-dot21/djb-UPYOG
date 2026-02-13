package org.egov.persistence.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.egov.domain.model.Token;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class TokenRowMapper implements RowMapper<Token> {

    private static final String YES = "Y";

    @Override
    public Token mapRow(final ResultSet rs, final int rowNum) throws SQLException {

        Token token = Token.builder().uuid(rs.getString("id"))
                .identity(rs.getString("tokenidentity"))
                .timeToLiveInSeconds(rs.getLong("ttlsecs"))
                .number(rs.getString("tokennumber"))
                .createdDate(rs.getDate("createddate"))
                .tenantId(rs.getString("tenantid"))
                .createdTime(rs.getLong("createddatenew")).build();

        token.setValidated(isValidated(rs.getString("validated")));

        // ✅ Minimal add: compute expiryDateTime = createddatenew + ttlsecs
        long createdMs = rs.getLong("createddatenew"); // epoch millis
        long ttlSecs = rs.getLong("ttlsecs");

        if (createdMs > 0 && ttlSecs > 0) {
            LocalDateTime createdLdt =
                    LocalDateTime.ofInstant(Instant.ofEpochMilli(createdMs), ZoneId.systemDefault());
            token.setExpiryDateTime(createdLdt.plusSeconds(ttlSecs));
        } else {
            token.setExpiryDateTime(null); // treat as invalid/expired later
        }

        return token;
    }

    public boolean isValidated(String validated) {
        return YES.equalsIgnoreCase(validated);
    }

}
