package com.xs.laboratory.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("asset_manage")
public class AssetManage {
    @TableId("recored_number")
    private String recoredNumber;

    @TableField("host_screen")
    private String hostScreen;

    @TableField("property_station")
    private String propertyStation;

    @TableField("station_number")
    private String stationNumber;

    @TableField("inventory_time")
    private String inventoryTime;

    public String getRecoredNumber() {
        return recoredNumber;
    }

    public void setRecoredNumber(String recoredNumber) {
        this.recoredNumber = recoredNumber;
    }

    public String getHostScreen() {
        return hostScreen;
    }

    public void setHostScreen(String hostScreen) {
        this.hostScreen = hostScreen;
    }

    public String getPropertyStation() {
        return propertyStation;
    }

    public void setPropertyStation(String propertyStation) {
        this.propertyStation = propertyStation;
    }

    public String getStationNumber() {
        return stationNumber;
    }

    public void setStationNumber(String stationNumber) {
        this.stationNumber = stationNumber;
    }

    public String getInventoryTime() {
        return inventoryTime;
    }

    public void setInventoryTime(String inventoryTime) {
        this.inventoryTime = inventoryTime;
    }
}
