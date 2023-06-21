package com.xs.laboratory.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.google.gson.Gson;
import com.xs.laboratory.bo.StudentInfoBo;
import com.xs.laboratory.config.WechatMiniConfig;
import com.xs.laboratory.entity.Manager;
import com.xs.laboratory.entity.StuAsset;
import com.xs.laboratory.mapper.StuAssetMapper;
import com.xs.laboratory.service.UserService;
import com.xs.laboratory.utils.HttpRequest;
import com.xs.laboratory.utils.JwtUtils;
import com.xs.laboratory.vo.InfoVO;
import com.xs.laboratory.vo.PhotosVO;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@SuppressWarnings("all")
@RequestMapping("/wechat")
public class UserController {
    @Value("${wx.miniapp.appid}")
    private String appid;

    @Value("${wx.miniapp.appsecret}")
    private String appsecret;

    public static final String AUTHORIZATION_CODE = "authorization_code";

    @Autowired
    private UserService userService;

    @Autowired
    private WechatMiniConfig wechatMiniConfig;

    @Autowired
    private StuAssetMapper stuAssetMapper;

    private Gson gson = new Gson();

    @GetMapping("/login")
    public InfoVO login(@RequestParam("code") String code, @RequestParam("phoneNumber") String phoneNumber) throws WxErrorException {
        InfoVO infoVO = new InfoVO();
        String token = null;

        if (Objects.isNull(code) && Objects.isNull(phoneNumber)){
            // 0表示失败
            infoVO.setStatusCode(0);
            return infoVO;
        }

        List<StuAsset> stuAssets = userService.getLogin(phoneNumber);
        if (stuAssets.isEmpty()){
            Manager manager = userService.getLoginM(phoneNumber);
            if (Objects.isNull(manager)){
                infoVO.setStatusCode(0);
                return infoVO;
            } else {
                token = JwtUtils.getToken(SetToken(code));
                infoVO.setTeacherNumber(manager.getTeacherNumber());
                infoVO.setTeacherName(manager.getTeacherName());
                infoVO.setTelNumber(phoneNumber);
                // 1表示学生，0表示老师
                infoVO.setIdentity(0);
                infoVO.setStatusCode(1);
                return infoVO;
            }
        }


//        WxMaService wxMaService = new WxMaServiceImpl();
//        wxMaService.setWxMaConfig(new WxMaDefaultConfigImpl());
//        WxMaJscode2SessionResult session = wxMaService.getUserService().getSessionInfo(code);

        //返回token
        token = JwtUtils.getToken(SetToken(code));

        infoVO.setToken(token);
        stuAssets.forEach(stuAsset -> {
        infoVO.setStudentName(stuAsset.getStudentName());
        infoVO.setStudentNumber(stuAsset.getStudentNumber());
        if ("1".equals(stuAsset.getAssetClass())){
            // 1 表示屏幕
            infoVO.setScreenCode(stuAsset.getAssetNumber());
        }else if ("2".equals(stuAsset.getAssetClass())){
            // 2 表示主机
                infoVO.setHostCode(stuAsset.getAssetNumber());
            }
        infoVO.setStationNumber(stuAsset.getStationNumber());
        infoVO.setTelNumber(phoneNumber);
        // 1表示学生，0表示老师
        infoVO.setIdentity(1);
        infoVO.setStatusCode(1);
        });
        return infoVO;
    }

    /**
     * 修改学生的个人相关信息
     * @return
     * @throws WxErrorException
     */
    @PostMapping("/updateInfo")
    public StudentInfoBo updateInfo(@RequestBody StudentInfoBo studentInfoBo) throws WxErrorException {
        List<StuAsset> stuAssets = userService.updateInfo(studentInfoBo);
        if (!stuAssets.isEmpty()){
            QueryWrapper<StuAsset> wrapper = new QueryWrapper<>();
            wrapper.eq("student_number",studentInfoBo.getStudentNumber());
            wrapper.eq("asset_class","1");
            QueryWrapper<StuAsset> wrapper2 = new QueryWrapper<>();
            wrapper2.eq("student_number",studentInfoBo.getStudentNumber());
            wrapper2.eq("asset_class","2");
            StuAsset stuAsset1 = stuAssets.get(0);
            stuAsset1.setAssetNumber(studentInfoBo.getScreenCode());
            stuAsset1.setStationNumber(studentInfoBo.getStationNumber());
            stuAsset1.setTelNumber(studentInfoBo.getTelNumber());
            stuAssetMapper.update(stuAsset1,wrapper);

            StuAsset stuAsset2 = stuAssets.get(1);
            stuAsset2.setAssetNumber(studentInfoBo.getHostCode());
            stuAsset2.setStationNumber(studentInfoBo.getStationNumber());
            stuAsset2.setTelNumber(studentInfoBo.getTelNumber());
            stuAssetMapper.update(stuAsset2,wrapper2);
            return studentInfoBo;

        }
        return null;
    }

    /**
     * 获取轮播图图片
     * @return 图片地址
     * @throws WxErrorException
     */
    @GetMapping("/getPhotos")
    public ArrayList<PhotosVO> getPhoto() throws WxErrorException {
        ArrayList<PhotosVO> photos = new ArrayList<>();
        PhotosVO photosVO1 = new PhotosVO();
        photosVO1.setId(1);
        photosVO1.setImage("http://127.0.0.1:9000/images/test1.jpg");
        photosVO1.setLink("");
        PhotosVO photosVO2 = new PhotosVO();
        photosVO2.setId(2);
        photosVO2.setImage("http://127.0.0.1:9000/images/test2.jpg");
        photosVO2.setLink("");

        photos.add(photosVO1);
        photos.add(photosVO2);

        return photos;
    }




    public Map<String, String> SetToken(String code){
        Map<String, String> map = new HashMap<>();

        // 小程序唯一标识 (在微信小程序管理后台获取)
        String wxspAppid = appid;
        // 小程序的 app secret (在微信小程序管理后台获取)
        String wxspSecret = appsecret;
        // 授权（必填）
        String grant_type = AUTHORIZATION_CODE;

        //////////////// 1、向微信服务器 使用登录凭证 code 获取 session_key 和 openid
        // 请求参数
        String params = "appid=" + wxspAppid + "&secret=" + wxspSecret + "&js_code=" + code + "&grant_type="
                + grant_type;
        // 发送请求
        String sr = HttpRequest.sendGet("https://api.weixin.qq.com/sns/jscode2session", params);


        //////////////// 2、对encryptedData加密数据进行AES解密 ////////////////
        try {
            // 解析相应内容（转换成json对象）
            JSONObject json = new JSONObject(sr);
            // 获取会话密钥（session_key）
            String sessionKey = json.get("session_key").toString();
            // 用户的唯一标识（openid）
            String openid = (String) json.get("openid").toString();

            map.put( "session_key",sessionKey);
            map.put( "openId",openid );
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }
}
