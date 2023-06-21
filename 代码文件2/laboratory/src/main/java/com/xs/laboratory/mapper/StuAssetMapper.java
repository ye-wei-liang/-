package com.xs.laboratory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xs.laboratory.entity.StuAsset;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StuAssetMapper extends BaseMapper<StuAsset> {
    public List<StuAsset> login(@Param("phoneNumber") String phoneNumber);

}
