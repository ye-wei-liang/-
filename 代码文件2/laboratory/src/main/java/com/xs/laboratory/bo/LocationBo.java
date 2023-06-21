package com.xs.laboratory.bo;

import java.util.Date;

public class LocationBo {
    private String record;

    private Date nowTimeStop;

    private String studentNumber;

    private String studentName;

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
