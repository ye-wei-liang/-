package com.xs.laboratory.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class JwtUtils {

    //设置签名
    private static final String SIGN = "jerry";

    /**
     * 生成token
     */

    public static String getToken(Map<String, String> map) {
        //设置有效时间,30分钟
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.MINUTE, 30);
        //创建 jwt builder
        JWTCreator.Builder builder = JWT.create();
        //payload
        map.forEach((k, v) -> {
            builder.withClaim(k, v);
        });
        String token = builder.withExpiresAt(instance.getTime())
                .sign(Algorithm.HMAC256(SIGN));
        return token;
    }


    /**
     * 验证token
     */
    public static void verifyToken(String token) {
        JWT.require(Algorithm.HMAC256(SIGN)).build().verify(token);
    }
}

