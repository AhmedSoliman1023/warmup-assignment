const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function
    let startParts = startTime.trim().split(" ");
    let startPeriod = startParts[1]; 
    let startTimeParts = startParts[0].split(":"); 
    let startH = parseInt(startTimeParts[0]);
    let startM = parseInt(startTimeParts[1]);
    let startS = parseInt(startTimeParts[2]);

    if (startPeriod === "pm" && startH !== 12) startH = startH + 12;
    if (startPeriod === "am" && startH === 12) startH = 0;

    let startTotalSeconds = startH * 3600 + startM * 60 + startS;

    let endParts = endTime.trim().split(" ");
    let endPeriod = endParts[1]; 
    let endTimeParts = endParts[0].split(":"); 
    let endH = parseInt(endTimeParts[0]);
    let endM = parseInt(endTimeParts[1]);
    let endS = parseInt(endTimeParts[2]);

    if (endPeriod === "pm" && endH !== 12) endH = endH + 12;
    if (endPeriod === "am" && endH === 12) endH = 0;

    let endTotalSeconds = endH * 3600 + endM * 60 + endS;

    let totalSeconds = endTotalSeconds - startTotalSeconds;

    // ✅ Fix: if negative, shift crossed midnight
    if (totalSeconds < 0) totalSeconds += 24 * 3600;

    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    let mm = String(m).padStart(2, "0");
    let ss = String(s).padStart(2, "0");

    return h + ":" + mm + ":" + ss;
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    // TODO: Implement this function
     
    let startParts = startTime.trim().split(" ");
    let startPeriod = startParts[1];
    let startTimeParts = startParts[0].split(":");
    let startH = parseInt(startTimeParts[0]);
    let startM = parseInt(startTimeParts[1]);
    let startS = parseInt(startTimeParts[2]);

    if (startPeriod === "pm" && startH !== 12) startH = startH + 12;
    if (startPeriod === "am" && startH === 12) startH = 0;

    let startTotalSeconds = startH * 3600 + startM * 60 + startS;

    let endParts = endTime.trim().split(" ");
    let endPeriod = endParts[1];
    let endTimeParts = endParts[0].split(":");
    let endH = parseInt(endTimeParts[0]);
    let endM = parseInt(endTimeParts[1]);
    let endS = parseInt(endTimeParts[2]);

    if (endPeriod === "pm" && endH !== 12) endH = endH + 12;
    if (endPeriod === "am" && endH === 12) endH = 0;

    let endTotalSeconds = endH * 3600 + endM * 60 + endS;

    // ✅ Fix: if end is before start, shift crossed midnight
    if (endTotalSeconds < startTotalSeconds) endTotalSeconds += 24 * 3600;

    let deliveryStart = 8 * 3600;
    let deliveryEnd = 22 * 3600;

    let idleBefore = 0;
    if (startTotalSeconds < deliveryStart) {
        idleBefore = Math.min(endTotalSeconds, deliveryStart) - startTotalSeconds;
    }

    let idleAfter = 0;
    if (endTotalSeconds > deliveryEnd) {
        idleAfter = endTotalSeconds - Math.max(startTotalSeconds, deliveryEnd);
    }

    let totalIdleSeconds = idleBefore + idleAfter;

    let h = Math.floor(totalIdleSeconds / 3600);
    let m = Math.floor((totalIdleSeconds % 3600) / 60);
    let s = totalIdleSeconds % 60;

    let mm = String(m).padStart(2, "0");
    let ss = String(s).padStart(2, "0");

    return h + ":" + mm + ":" + ss;
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
    let shiftParts = shiftDuration.split(":");
    let shiftH = parseInt(shiftParts[0]);
    let shiftM = parseInt(shiftParts[1]);
    let shiftS = parseInt(shiftParts[2]);

    
    let shiftTotalSeconds = shiftH * 3600 + shiftM * 60 + shiftS;

    
    let idleParts = idleTime.split(":");
    let idleH = parseInt(idleParts[0]);
    let idleM = parseInt(idleParts[1]);
    let idleS = parseInt(idleParts[2]);

    
    let idleTotalSeconds = idleH * 3600 + idleM * 60 + idleS;

   
    let totalActiveSeconds = shiftTotalSeconds - idleTotalSeconds;

    
    let h = Math.floor(totalActiveSeconds / 3600);
    let m = Math.floor((totalActiveSeconds % 3600) / 60);
    let s = totalActiveSeconds % 60;

    let mm = String(m).padStart(2, "0");
    let ss = String(s).padStart(2, "0");

    return h + ":" + mm + ":" + ss;
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
    let dateParts = date.split("-");
    let year = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]);
    let day = parseInt(dateParts[2]);

    
    let quotaSeconds = 0;

    
    if (year === 2025 && month === 4 && day >= 10 && day <= 30) {
        quotaSeconds = 6 * 3600; 
    } else {
        quotaSeconds = 8 * 3600 + 24 * 60; 
    }

    
    let activeParts = activeTime.split(":");
    let activeH = parseInt(activeParts[0]);
    let activeM = parseInt(activeParts[1]);
    let activeS = parseInt(activeParts[2]);

    
    let activeTotalSeconds = activeH * 3600 + activeM * 60 + activeS;

    
    if (activeTotalSeconds >= quotaSeconds) {
        return true;
    } else {
        return false;
    }
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
     let fileContent = fs.readFileSync(textFile, "utf-8");
    let lines = fileContent.trim().split("\n");

    
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        let existingDate = columns[2].trim();
        if (existingDriverID === shiftObj.driverID && existingDate === shiftObj.date) {
            return {};
        }
    }

    
    let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
    let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
    let activeTime = getActiveTime(shiftDuration, idleTime);
    let quota = metQuota(shiftObj.date, activeTime);
    let hasBonus = false;

    
    let newRecord = shiftObj.driverID + "," + shiftObj.driverName + "," + shiftObj.date + "," + shiftObj.startTime + "," + shiftObj.endTime + "," + shiftDuration + "," + idleTime + "," + activeTime + "," + quota + "," + hasBonus;

    
    let lastIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        if (existingDriverID === shiftObj.driverID) {
            lastIndex = i;
        }
    }

    
    if (lastIndex !== -1) {
        lines.splice(lastIndex + 1, 0, newRecord);
    } else {
        lines.push(newRecord);
    }

    
    fs.writeFileSync(textFile, lines.join("\n"), "utf-8");

    
    let newObj = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime: idleTime,
        activeTime: activeTime,
        metQuota: quota,
        hasBonus: hasBonus
    };

    return newObj;

}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
    
    let fileContent = fs.readFileSync(textFile, "utf-8");
    let lines = fileContent.trim().split("\n");

    
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        let existingDate = columns[2].trim();

        
        if (existingDriverID === driverID && existingDate === date) {
            columns[9] = newValue;
            lines[i] = columns.join(",");
        }
    }

    
    fs.writeFileSync(textFile, lines.join("\n"), "utf-8");
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
    
    let fileContent = fs.readFileSync(textFile, "utf-8");
    let lines = fileContent.trim().split("\n");

    
    let driverExists = false;
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        if (existingDriverID === driverID) {
            driverExists = true;
            break;
        }
    }

   
    if (driverExists === false) {
        return -1;
    }

    
    let bonusCount = 0;
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        let existingDate = columns[2].trim();
        let existingHasBonus = columns[9].trim();

        
        let existingMonth = parseInt(existingDate.split("-")[1]);

        
        if (existingDriverID === driverID && existingMonth === parseInt(month) && existingHasBonus === "true") {
            bonusCount++;
        }
    }

    return bonusCount;
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    
    let fileContent = fs.readFileSync(textFile, "utf-8");
    let lines = fileContent.trim().split("\n");

    
    let totalActiveSeconds = 0;

    
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        let existingDate = columns[2].trim();
        let existingActiveTime = columns[7].trim();

        
        let existingMonth = parseInt(existingDate.split("-")[1]);

        
        if (existingDriverID === driverID && existingMonth === month) {
            
            let activeParts = existingActiveTime.split(":");
            let activeH = parseInt(activeParts[0]);
            let activeM = parseInt(activeParts[1]);
            let activeS = parseInt(activeParts[2]);

            totalActiveSeconds = totalActiveSeconds + activeH * 3600 + activeM * 60 + activeS;
        }
    }

    
    let h = Math.floor(totalActiveSeconds / 3600);
    let m = Math.floor((totalActiveSeconds % 3600) / 60);
    let s = totalActiveSeconds % 60;

    
    
    let mm = String(m).padStart(2, "0");
    let ss = String(s).padStart(2, "0");

    return h + ":" + mm + ":" + ss;
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
    
    let fileContent = fs.readFileSync(textFile, "utf-8");
    let lines = fileContent.trim().split("\n");

    let rateContent = fs.readFileSync(rateFile, "utf-8");
    let rateLines = rateContent.trim().split("\n");

    
    let dayOff = "";
    for (let i = 0; i < rateLines.length; i++) {
        let columns = rateLines[i].split(",");
        let existingDriverID = columns[0].trim();
        if (existingDriverID === driverID) {
            dayOff = columns[1].trim();
            break;
        }
    }

    
    let totalRequiredSeconds = 0;

    
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(",");
        let existingDriverID = columns[0].trim();
        let existingDate = columns[2].trim();

        
        let existingMonth = parseInt(existingDate.split("-")[1]);

        
        if (existingDriverID === driverID && existingMonth === month) {
            
            let shiftDate = new Date(existingDate);
            let dayOfWeek = shiftDate.toLocaleDateString("en-US", { weekday: "long" });

            
            if (dayOfWeek === dayOff) {
                continue;
            }

            
            let existingYear = parseInt(existingDate.split("-")[0]);
            let existingDay = parseInt(existingDate.split("-")[2]);

            
            if (existingYear === 2025 && existingMonth === 4 && existingDay >= 10 && existingDay <= 30) {
                totalRequiredSeconds = totalRequiredSeconds + 6 * 3600; 
            } else {
                totalRequiredSeconds = totalRequiredSeconds + 8 * 3600 + 24 * 60; 
            }
        }
    }

    
    totalRequiredSeconds = totalRequiredSeconds - bonusCount * 2 * 3600;

    
    let h = Math.floor(totalRequiredSeconds / 3600);
    let m = Math.floor((totalRequiredSeconds % 3600) / 60);
    let s = totalRequiredSeconds % 60;

    
    
    let mm = String(m).padStart(2, "0");
    let ss = String(s).padStart(2, "0");

    return h + ":" + mm + ":" + ss;
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
    
    let rateContent = fs.readFileSync(rateFile, "utf-8");
    let rateLines = rateContent.trim().split("\n");

    
    let basePay = 0;
    let tier = 0;
    for (let i = 0; i < rateLines.length; i++) {
        let columns = rateLines[i].split(",");
        let existingDriverID = columns[0].trim();
        if (existingDriverID === driverID) {
            basePay = parseInt(columns[2].trim());
            tier = parseInt(columns[3].trim());
            break;
        }
    }

    
    let actualParts = actualHours.split(":");
    let actualH = parseInt(actualParts[0]);
    let actualM = parseInt(actualParts[1]);
    let actualS = parseInt(actualParts[2]);
    let actualTotalSeconds = actualH * 3600 + actualM * 60 + actualS;

    
    let requiredParts = requiredHours.split(":");
    let requiredH = parseInt(requiredParts[0]);
    let requiredM = parseInt(requiredParts[1]);
    let requiredS = parseInt(requiredParts[2]);
    let requiredTotalSeconds = requiredH * 3600 + requiredM * 60 + requiredS;

    
    if (actualTotalSeconds >= requiredTotalSeconds) {
        return basePay;
    }

   
    let missingSeconds = requiredTotalSeconds - actualTotalSeconds;

    
    let allowedMissingHours = 0;
    if (tier === 1) allowedMissingHours = 50;
    if (tier === 2) allowedMissingHours = 20;
    if (tier === 3) allowedMissingHours = 10;
    if (tier === 4) allowedMissingHours = 3;

   
    let remainingMissingSeconds = missingSeconds - allowedMissingHours * 3600;

    
    if (remainingMissingSeconds <= 0) {
        return basePay;
    }

    
    let billableMissingHours = Math.floor(remainingMissingSeconds / 3600);

    
    let deductionRatePerHour = Math.floor(basePay / 185);
    let salaryDeduction = billableMissingHours * deductionRatePerHour;

    
    let netPay = basePay - salaryDeduction;

    return netPay;
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
