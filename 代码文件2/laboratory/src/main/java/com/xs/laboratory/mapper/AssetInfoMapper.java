package com.xs.laboratory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xs.laboratory.entity.AssetInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AssetInfoMapper extends BaseMapper<AssetInfo> {
    public void setAssetInfo(@Param("asset_number") String assetNumber,
                             @Param("asset_class") String assetClass,
                             @Param("station_number") String stationNumber,
                             @Param("remark") String remark);
}
