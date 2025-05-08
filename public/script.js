const daysGrid = document.getElementById("daysGrid");
const monthYear = document.getElementById("monthYear");

// กำหนดตัวแปร currentDate และค่าปัจจุบัน
let currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

document.addEventListener("click", (event) => {
  // ตรวจสอบว่าคลิกเกิดขึ้นนอก tooltip หรือไม่
  if (!event.target.closest(".day")) {
    // ซ่อน tooltip ทั้งหมด
    document.querySelectorAll(".day").forEach((d) => {
      d.classList.remove("show-tooltip");
    });
  }
});

// ฟังก์ชันดึงข้อมูลวันหยุดจาก API
async function fetchHolidays(year, month) {
  try {
    const response = await fetch(`/holidays/${year}/${month + 1}`);
    const holidays = await response.json();
    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
}

// ฟังก์ชันแสดงปฏิทิน
async function renderCalendar() {
  daysGrid.innerHTML = ""; // ล้างปฏิทินก่อนสร้างใหม่
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ตั้งค่าชื่อเดือนและปีในส่วนหัว
  monthYear.innerText = `${currentDate.toLocaleString("th-TH", {
    month: "long",
  })} ${year + 543}`;

  // คำนวณวันแรกของเดือนและจำนวนวันในเดือน
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // ดึงข้อมูลวันหยุด
  const holidays = await fetchHolidays(year, month);

  // เพิ่มช่องว่างก่อนวันที่ 1
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    daysGrid.appendChild(emptyCell);
  }

  // เพิ่มวันที่ในเดือน
  for (let i = 1; i <= lastDate; i++) {
    let dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = i;

    // ไฮไลท์วันปัจจุบัน
    if (year === currentYear && month === currentMonth && i === currentDay) {
      dayDiv.classList.add("today");
    }

    // ไฮไลท์วันอาทิตย์
    const dayOfWeek = new Date(year, month, i).getDay();
    if (dayOfWeek === 0) {
      dayDiv.classList.add("sunday");
    }

    // ไฮไลท์วันหยุด
    const holiday = holidays.find((h) => {
      const holidayDate = new Date(h.Date);
      return (
        holidayDate.getFullYear() === year &&
        holidayDate.getMonth() === month &&
        holidayDate.getDate() === i
      );
    });

    if (holiday) {
      dayDiv.classList.add("holiday");

      // สร้าง tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = holiday.HolidayDescriptionThai || "ไม่มีคำอธิบาย";

      // เพิ่ม tooltip เข้าไปใน dayDiv
      dayDiv.appendChild(tooltip);

      // เพิ่ม event listener สำหรับการคลิก
      dayDiv.addEventListener("click", () => {
        // ซ่อน tooltip อื่น ๆ ก่อน
        document.querySelectorAll(".day").forEach((d) => {
          d.classList.remove("show-tooltip");
        });

        // แสดง tooltip ของวันหยุดที่คลิก
        dayDiv.classList.toggle("show-tooltip");
      });
    }

    daysGrid.appendChild(dayDiv);
  }
}

// เรียกฟังก์ชันแสดงปฏิทินครั้งแรก
renderCalendar();
