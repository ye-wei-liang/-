package com.xs.laboratory.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("device")
public class Device {
    @TableId(type = IdType.AUTO)
    private int id;
    @TableField
    private String name;
    @TableField
    private String isOrder;

    public Device(int id, String name,String isOrder) {
        this.id = id;
        this.name = name;
        this.isOrder = isOrder;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIsOrder() {
        return isOrder;
    }

    public void setIsOrder(String isOrder) {
        this.isOrder = isOrder;
    }
}
