package com.xs.laboratory.service;

import com.xs.laboratory.bo.StudentInfoBo;
import com.xs.laboratory.entity.Manager;
import com.xs.laboratory.entity.StuAsset;

import java.util.List;

public interface UserService {
    public List<StuAsset> getLogin(String phoneNumber);

    public Manager  getLoginM(String phoneNumber);

    public  List<StuAsset> updateInfo(StudentInfoBo studentInfoBo);
}
