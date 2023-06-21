package com.xs.laboratory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xs.laboratory.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
