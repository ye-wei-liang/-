package com.xs.laboratory.controller;

import com.google.gson.Gson;
import com.xs.laboratory.entity.Device;
import com.xs.laboratory.mapper.DeviceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
public class DeviceController {
    @Autowired
    private DeviceMapper  deviceMapper;
    private  Gson gson = new Gson();

    @GetMapping("/devices")
    public String getDevices(){
        List<Device> devices = deviceMapper.selectList(null);
        return gson.toJson(devices);
    }

    @PostMapping("/delete")
    public void deleteDevices(@RequestBody Device device){
        deviceMapper.deleteById(device.getId());

    }

    @PostMapping("/modify")
    public void modifyDevices(@RequestBody Device device){
       deviceMapper.updateById(device);

    }

    @PostMapping("/add")
    public void addDevices(@RequestBody Device device){
        deviceMapper.insert(device);

    }

    @PostMapping("/order")
    public String orderDevices(@RequestBody Device device){
        Device device1 = deviceMapper.getDevice(device.getName());
        if (device1!=null){
            if (device1.getIsOrder().equals("否")){
                device1.setIsOrder("是");
                deviceMapper.updateById(device1);
                return "1";
            } else {
                return "0";
            }
        }
        return "0";
    }
}
