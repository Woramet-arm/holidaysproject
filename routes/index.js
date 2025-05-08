const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const apiUrl =
  "https://apigw1.bot.or.th/bot/public/financial-institutions-holidays/";
const apiKey = process.env.API_KEY;

let holiday = [];

// ฟังก์ชันดึงข้อมูลวันหยุดจาก API
async function fetchHolidaysData() {
  try {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`${apiUrl}?year=${currentYear}`, {
      headers: { "X-IBM-Client-Id": apiKey },
    });

    // แปลงข้อมูลและเก็บในตัวแปร holiday
    holiday = response.data.result.data.map(transformHolidayData);
  } catch (err) {
    console.error("Error fetching data:", err.message);
  }
}

// ฟังก์ชันแปลงข้อมูลวันหยุด
function transformHolidayData(data) {
  const dateObj = new Date(data.Date);
  return {
    ...data,
    MonthNameThai: getMonthName(dateObj.getMonth()), // เพิ่มชื่อเดือนภาษาไทย
  };
}

// ฟังก์ชันแปลงเลขเดือนเป็นชื่อเดือนภาษาไทย
function getMonthName(monthNumber) {
  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  return monthNames[monthNumber];
}

// ดึงข้อมูลวันหยุดทุก 1 ชั่วโมง
setInterval(fetchHolidaysData, 3600000);
fetchHolidaysData();

// Route: แสดงหน้าแรก
router.get("/", (req, res) => {
  res.render("index", { holiday });
});

// Route: ดึงวันหยุดตามปีและเดือน
router.get("/holidays/:year/:month", (req, res) => {
  const { year, month } = req.params;

  const filteredHolidays = holiday.filter((h) => {
    const holidayDate = new Date(h.Date);
    return (
      holidayDate.getFullYear() === parseInt(year) &&
      holidayDate.getMonth() + 1 === parseInt(month)
    );
  });

  const holidaysWithDescription = filteredHolidays.map((h) => ({
    ...h,
    HolidayDescriptionThai: h.HolidayDescriptionThai || "ไม่มีคำอธิบาย",
  }));

  res.json(holidaysWithDescription);
});

// Route: แสดงวันหยุดทั้งหมด
router.get("/holidays", (req, res) => {
  if (!holiday || holiday.length === 0) {
    return res.status(503).send("กำลังโหลดข้อมูลวันหยุด กรุณาลองใหม่อีกครั้ง");
  }

  const holidaysByMonth = holiday.reduce((acc, h) => {
    const month = h.MonthNameThai;
    if (!acc[month]) acc[month] = [];
    acc[month].push(h);
    return acc;
  }, {});

  res.render("holidays", {
    title: "ดูวันหยุดทั้งหมด",
    holidays: holidaysByMonth,
  });
});

module.exports = router;
