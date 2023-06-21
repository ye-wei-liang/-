package com.xs.laboratory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xs.laboratory.entity.Device;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DeviceMapper extends BaseMapper<Device> {
    public Device getDevice(@Param("name") String name);
}
