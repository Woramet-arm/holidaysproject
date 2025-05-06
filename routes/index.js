var express = require("express");
var router = express.Router();
const axios = require("axios");
let current;
const apiUrl =
  "https://apigw1.bot.or.th/bot/public/financial-institutions-holidays/";
const apiKey = "08a5cc74-12f6-4edc-8d3e-d8325180a3aa";
let holiday = [];

async function fetchHolidaysData() {
  try {
    current = new Date();
    holiday = [];
    const response = await axios.get(
      `${apiUrl}?year=${current.getFullYear()}`,
      {
        headers: {
          "X-IBM-Client-Id": apiKey,
        },
      }
    );

    // เก็บข้อมูลลง holiday
    holiday.push(...response.data.result.data); // ใช้ spread operator เพื่อเก็บข้อมูลใน array

    // แปลงข้อมูลใน array holiday ด้วย transformHolidayData
    holiday = holiday.map((item) => transformHolidayData(item));
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).send("Error fetching data: " + err.message);
  }
}

// ฟังก์ชันแปลงเลขเดือนเป็นชื่อเดือน
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

  return monthNames[monthNumber]; // เลขเดือนจาก getMonth() จะเป็น 0-11
}

// ฟังก์ชันจัดการข้อมูล API
function transformHolidayData(data) {
  const dateObj = new Date(data.Date); // แปลง Date จาก string เป็น Date object
  const monthNumber = dateObj.getMonth(); // ดึงเลขเดือน (0-11)

  // เพิ่มชื่อเดือนเข้าไปใน object
  return {
    ...data,
    MonthNameThai: getMonthName(monthNumber), // ชื่อเดือนภาษาไทย
  };
}

setInterval(fetchHolidaysData, 3600000);

fetchHolidaysData();
/* GET home page. */
router.get("/", function (req, res, next) {
  // ส่งข้อมูล holiday ไปยังไฟล์ EJS
  res.render("index", { holiday });
});

router.get("/holidays/:year/:month", (req, res) => {
  const { year, month } = req.params;

  // กรองวันหยุดเฉพาะปีและเดือนที่ร้องขอ
  const filteredHolidays = holiday.filter((h) => {
    const holidayDate = new Date(h.Date);
    return (
      holidayDate.getFullYear() === parseInt(year) &&
      holidayDate.getMonth() + 1 === parseInt(month)
    );
  });

  // เพิ่ม HolidayDescriptionThai หากไม่มี
  const holidaysWithDescription = filteredHolidays.map((h) => ({
    ...h,
    HolidayDescriptionThai: h.HolidayDescriptionThai || "ไม่มีคำอธิบาย", // เพิ่มข้อความเริ่มต้นหากไม่มีค่า
  }));

  res.json(holidaysWithDescription); // ส่งข้อมูลวันหยุดกลับไปในรูปแบบ JSON
});

module.exports = router;
