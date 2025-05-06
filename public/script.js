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

async function renderCalendar() {
  daysGrid.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.innerText = `${currentDate.toLocaleString("th-TH", {
    month: "long",
  })} ${year + 543}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const holidays = await fetchHolidays(year, month);

  for (let i = 0; i < firstDay; i++) {
    daysGrid.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = i;

    // 🎯 ไฮไลท์วันปัจจุบัน
    if (year === currentYear && month === currentMonth && i === currentDay) {
      dayDiv.classList.add("today");
    }

    const dayOfWeek = new Date(year, month, i).getDay();
    if (dayOfWeek === 0) {
      // 0 หมายถึงวันอาทิตย์
      dayDiv.classList.add("sunday");
    }

    // 🎈 ไฮไลท์วันหยุด
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
      tooltip.textContent = holiday.HolidayDescriptionThai || "ไม่มีคำอธิบาย"; // ตรวจสอบว่ามี HolidayDescriptionThai หรือไม่

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

renderCalendar();
