package com.xs.laboratory.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.util.Date;

@TableName("location")
public class Location {
    @TableId(value = "location_id",type = IdType.AUTO)
    private int locationId;

    @TableField("record")
    private String record;

    @TableField("now_time_stop")
    private Date nowTimeStop;

    @TableField("student_number")
    private String studentNumber;

    @TableField("student_name")
    private String studentName;

    public int getLocationId() {
        return locationId;
    }

    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }

    public String getRecord() {
        return record;
    }

    public void setRecord(String record) {
        this.record = record;
    }

    public Date getNowTimeStop() {
        return nowTimeStop;
    }

    public void setNowTimeStop(Date nowTimeStop) {
        this.nowTimeStop = nowTimeStop;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}
