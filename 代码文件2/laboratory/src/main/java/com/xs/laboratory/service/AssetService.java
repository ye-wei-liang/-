package com.xs.laboratory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xs.laboratory.entity.AssetInfo;

public interface AssetService extends IService<AssetInfo> {
    public int setAssetInfo(AssetInfo assetInfo);

}
