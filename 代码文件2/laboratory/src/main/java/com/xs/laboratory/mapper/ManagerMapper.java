package com.xs.laboratory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xs.laboratory.entity.Manager;
import com.xs.laboratory.entity.StuAsset;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ManagerMapper extends BaseMapper<Manager> {
    public Manager login(@Param("phoneNumber") String phoneNumber);
}
