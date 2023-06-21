package com.xs.laboratory.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xs.laboratory.bo.AssetBo;
import com.xs.laboratory.bo.LocationBo;
import com.xs.laboratory.entity.AssetInfo;
import com.xs.laboratory.entity.Location;
import com.xs.laboratory.mapper.AssetInfoMapper;
import com.xs.laboratory.mapper.LocationMapper;
import com.xs.laboratory.service.AssetService;
import com.xs.laboratory.vo.SubmitVo;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@SuppressWarnings("all")
@RequestMapping("/asset")
public class AssetController {

   @Autowired
   private AssetService assetService;

   @Autowired
   private AssetInfoMapper assetInfoMapper;

   @Autowired
   private LocationMapper locationMapper;

    /**
     * 提交资产信息
     * @param assetBo
     * @return
     * @throws WxErrorException
     */
    @PostMapping("/submit")
    public SubmitVo submitAsset(@RequestBody AssetBo assetBo) throws WxErrorException{
        AssetInfo assetInfoSc = new AssetInfo();
        assetInfoSc.setAssetId(0);
        assetInfoSc.setStationNumber(assetBo.getStationCode());
        assetInfoSc.setAssetClass("1");
        assetInfoSc.setAssetNumber(assetBo.getScreenCode());
        assetInfoSc.setRemark(assetBo.getRemark());
        assetInfoSc.setCurrentTime(assetBo.getCurrentTime());

        AssetInfo assetInfoHs = new AssetInfo();
        assetInfoHs.setAssetId(0);
        assetInfoHs.setStationNumber(assetBo.getStationCode());
        assetInfoHs.setAssetClass("2");
        assetInfoHs.setAssetNumber(assetBo.getHostCode());
        assetInfoHs.setRemark(assetBo.getRemark());
        assetInfoHs.setCurrentTime(assetBo.getCurrentTime());

        QueryWrapper<AssetInfo> wrapper1 = new QueryWrapper<>();
        wrapper1.eq("asset_number",assetBo.getScreenCode());
        int i1=0,i2=0;
        AssetInfo assetInfo = assetInfoMapper.selectOne(wrapper1);
        AssetInfo assetInfo2 = assetInfoMapper.selectOne(new QueryWrapper<AssetInfo>()
                .eq("asset_number",assetBo.getHostCode()));

        if (Objects.isNull(assetInfo) && Objects.isNull(assetInfo2)) {
//            i1 = assetService.setAssetInfo(assetInfoSc);
//            i2 = assetService.setAssetInfo(assetInfoHs);
            List<AssetInfo> assetInfos = new ArrayList<AssetInfo>();
            assetInfos.add(assetInfoSc);
            assetInfos.add(assetInfoHs);
            assetService.saveBatch(assetInfos);
        }
        SubmitVo submitVo = new SubmitVo();
        if (i1!=0 && i2!=0){
            submitVo.setMark(1);
            return submitVo;
        }else {
            submitVo.setMark(0);
            return submitVo;
        }
    }

    /**
     * 提交定位信息
     * @param locationBo
     * @return
     */
    @RequestMapping("/location")
    public int sumbmitLocation(@RequestBody LocationBo locationBo){
        Location location = new Location();
        location.setStudentNumber(locationBo.getStudentNumber());
        location.setStudentName(locationBo.getStudentName());
        location.setNowTimeStop(locationBo.getNowTimeStop());
        location.setRecord(locationBo.getRecord());
        return locationMapper.insert(location);
    }


    @GetMapping("/getMap")
    public String getMap(@RequestParam("tihuoWay") String tihuoWay) throws WxErrorException {
        String imgURL = "http://127.0.0.1:9000/images/"+tihuoWay+".png";
        return imgURL;
    }





}
