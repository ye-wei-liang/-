package com.xs.laboratory.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xs.laboratory.bo.StudentInfoBo;
import com.xs.laboratory.entity.AssetInfo;
import com.xs.laboratory.entity.Manager;
import com.xs.laboratory.entity.StuAsset;
import com.xs.laboratory.mapper.AssetInfoMapper;
import com.xs.laboratory.mapper.ManagerMapper;
import com.xs.laboratory.mapper.StuAssetMapper;
import com.xs.laboratory.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private StuAssetMapper stuAssetMapper;

    @Autowired
    private ManagerMapper managerMapper;

    @Autowired
    private AssetInfoMapper assetInfoMapper;


    @Override
    public List<StuAsset> getLogin(String phoneNumber) {
        return stuAssetMapper.login(phoneNumber);
    }

    @Override
    public Manager getLoginM(String phoneNumber) {
        return managerMapper.login(phoneNumber);
    }

    @Override
    public  List<StuAsset> updateInfo(StudentInfoBo studentInfoBo) {
        List<StuAsset> stuAssets = stuAssetMapper
                .selectList(new QueryWrapper<StuAsset>().eq("student_number", studentInfoBo.getStudentNumber()));
        if (!stuAssets.isEmpty()){
            AssetInfo assetInfo1 = assetInfoMapper
                    .selectOne(new QueryWrapper<AssetInfo>().eq("asset_number", stuAssets.get(0).getAssetNumber()));
            assetInfo1.setAssetNumber(studentInfoBo.getScreenCode());
            assetInfo1.setStationNumber(studentInfoBo.getStationNumber());

            AssetInfo assetInfo2 = assetInfoMapper
                    .selectOne(new QueryWrapper<AssetInfo>().eq("asset_number", stuAssets.get(1).getAssetNumber()));
            assetInfo2.setAssetNumber(studentInfoBo.getHostCode());
            assetInfo2.setStationNumber(studentInfoBo.getStationNumber());

            assetInfoMapper.update(assetInfo1,new QueryWrapper<AssetInfo>().eq("asset_number",stuAssets.get(0).getAssetNumber()));
            assetInfoMapper.update(assetInfo2,new QueryWrapper<AssetInfo>().eq("asset_number",stuAssets.get(1).getAssetNumber()));

            return stuAssets;

        }else {
            return null;
        }


    }
}
