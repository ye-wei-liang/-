package com.xs.laboratory.serviceImpl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xs.laboratory.entity.AssetInfo;
import com.xs.laboratory.mapper.AssetInfoMapper;
import com.xs.laboratory.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AssetServiceImpl extends ServiceImpl<AssetInfoMapper,AssetInfo> implements AssetService {
    @Autowired
    private AssetInfoMapper assetInfoMapper;

    @Override
    public int setAssetInfo(AssetInfo assetInfo) {
        return assetInfoMapper.insert(assetInfo);
    }


}
