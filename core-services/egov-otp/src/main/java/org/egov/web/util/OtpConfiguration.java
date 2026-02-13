package org.egov.web.util;

import lombok.*;
import org.egov.tracer.config.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.stereotype.*;

@Import({TracerConfiguration.class})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class OtpConfiguration {
    @Value("${egov.otp.ttl}")
    private long ttl;

    @Value("${egov.otp.length}")
    private int otpLength;

    @Value("${egov.otp.encrypt}")
    private boolean encryptOTP;

    @Value("${egov.otp.default.enabled:false}")
    private boolean defaultOtpEnabled;

    @Value("${egov.otp.default.value:123456}")
    private String defaultOtpValue;

}