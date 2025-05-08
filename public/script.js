const daysGrid = document.getElementById("daysGrid");
const monthYear = document.getElementById("monthYear");

// กำหนดตัวแปร currentDate และค่าปัจจุบัน
let currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

// ซ่อน tooltip ทั้งหมดเมื่อคลิกนอก tooltip
document.addEventListener("click", (event) => {
  if (!event.target.closest(".day")) {
    hideAllTooltips();
  }
});

// ฟังก์ชันซ่อน tooltip ทั้งหมด
function hideAllTooltips() {
  document.querySelectorAll(".day").forEach((day) => {
    day.classList.remove("show-tooltip");
  });
}

// ฟังก์ชันดึงข้อมูลวันหยุดจาก API
async function fetchHolidays(year, month) {
  try {
    const response = await fetch(`/holidays/${year}/${month + 1}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
}

// ฟังก์ชันแสดงปฏิทิน
async function renderCalendar() {
  clearCalendar();
  updateMonthYearHeader();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const holidays = await fetchHolidays(year, month);

  addEmptyCells(firstDay);
  addDaysToCalendar(year, month, lastDate, holidays);
}

// ฟังก์ชันล้างปฏิทิน
function clearCalendar() {
  daysGrid.innerHTML = "";
}

// ฟังก์ชันอัปเดตส่วนหัวของเดือนและปี
function updateMonthYearHeader() {
  const year = currentDate.getFullYear();
  monthYear.innerText = `${currentDate.toLocaleString("th-TH", {
    month: "long",
  })} ${year + 543}`;
}

// ฟังก์ชันเพิ่มช่องว่างก่อนวันที่ 1
function addEmptyCells(firstDay) {
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    daysGrid.appendChild(emptyCell);
  }
}

// ฟังก์ชันเพิ่มวันที่ในปฏิทิน
function addDaysToCalendar(year, month, lastDate, holidays) {
  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = createDayDiv(year, month, day, holidays);
    daysGrid.appendChild(dayDiv);
  }
}

// ฟังก์ชันสร้าง div สำหรับวัน
function createDayDiv(year, month, day, holidays) {
  const dayDiv = document.createElement("div");
  dayDiv.className = "day";
  dayDiv.textContent = day;

  highlightToday(dayDiv, year, month, day);
  highlightSunday(dayDiv, year, month, day);
  addHolidayTooltip(dayDiv, year, month, day, holidays);

  return dayDiv;
}

// ฟังก์ชันไฮไลท์วันปัจจุบัน
function highlightToday(dayDiv, year, month, day) {
  if (year === currentYear && month === currentMonth && day === currentDay) {
    dayDiv.classList.add("today");
  }
}

// ฟังก์ชันไฮไลท์วันอาทิตย์
function highlightSunday(dayDiv, year, month, day) {
  const dayOfWeek = new Date(year, month, day).getDay();
  if (dayOfWeek === 0) {
    dayDiv.classList.add("sunday");
  }
}

// ฟังก์ชันเพิ่ม tooltip สำหรับวันหยุด
function addHolidayTooltip(dayDiv, year, month, day, holidays) {
  const holiday = holidays.find((h) => {
    const holidayDate = new Date(h.Date);
    return (
      holidayDate.getFullYear() === year &&
      holidayDate.getMonth() === month &&
      holidayDate.getDate() === day
    );
  });

  if (holiday) {
    dayDiv.classList.add("holiday");

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = holiday.HolidayDescriptionThai || "ไม่มีคำอธิบาย";
    dayDiv.appendChild(tooltip);

    dayDiv.addEventListener("click", () => {
      hideAllTooltips();
      dayDiv.classList.toggle("show-tooltip");
    });
  }
}

// เรียกฟังก์ชันแสดงปฏิทินครั้งแรก
renderCalendar();
