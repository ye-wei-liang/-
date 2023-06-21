package com.xs.laboratory.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "wx.miniapp")
public class WechatMiniConfig {
        private String appid;
        private String appsecret;

        // getters and setters
}
