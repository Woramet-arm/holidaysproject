ด้านล่างนี้คือเนื้อหาไฟล์ `README.md` ที่เหมาะสมสำหรับโปรเจกต์ของคุณ:

---

````markdown
# ปฏิทินวันหยุด (Holiday Calendar)

โปรเจกต์นี้เป็นแอปพลิเคชัน Node.js ที่แสดงปฏิทินวันหยุดของธนาคาร โดยดึงข้อมูลวันหยุดจาก API ของธนาคารแห่งประเทศไทย และแสดงผลในรูปแบบเว็บแอปพลิเคชัน

## คุณสมบัติ

- แสดงปฏิทินวันหยุดพร้อมการไฮไลต์วันหยุด
- แสดงรายการวันหยุดทั้งหมดในรูปแบบที่จัดกลุ่มตามเดือน
- รองรับการแสดงผลภาษาไทย
- ใช้ธีมสีเขียวที่เข้ากับภาพลักษณ์ของธนาคาร ธกส.

## การติดตั้ง

1. **Clone โปรเจกต์นี้จาก GitHub:**
   ```bash
   git clone https://github.com/username/holiday-calendar.git
   cd holiday-calendar
   ```
````

2. **ติดตั้ง Dependencies:**

   ```bash
   npm install
   ```

3. **สร้างไฟล์ `.env`:**
   สร้างไฟล์ `.env` ใน root directory และเพิ่ม API Key:

   ```env
   API_KEY=your_api_key_here
   ```

4. **รันแอปพลิเคชัน:**

   ```bash
   npm start
   ```

   หรือ:

   ```bash
   node ./bin/www
   ```

5. **เปิดเบราว์เซอร์และเข้าถึงแอปพลิเคชัน:**
   ```
   http://localhost:3000
   ```

## โครงสร้างโปรเจกต์

```
holidays/
├── bin/
│   └── www                 # Entry point ของแอปพลิเคชัน
├── public/
│   ├── stylesheets/        # ไฟล์ CSS
│   ├── javascripts/        # ไฟล์ JavaScript ฝั่ง Client
│   └── images/             # ไฟล์รูปภาพ
├── routes/
│   └── index.js            # Routing หลักของแอปพลิเคชัน
├── views/
│   ├── index.ejs           # หน้าแรก (ปฏิทิน)
│   ├── holidays.ejs        # หน้ารายการวันหยุดทั้งหมด
├── .env                    # เก็บ API Key (ไม่ควร Push ไปยัง GitHub)
├── .gitignore              # ไฟล์ที่ไม่ต้องการ Push
├── package.json            # ข้อมูล Dependencies และ Scripts
└── README.md               # คำอธิบายโปรเจกต์
```

## การใช้งาน

- **หน้าแรก (`/`)**: แสดงปฏิทินวันหยุดพร้อมการไฮไลต์วันหยุด.
- **หน้าวันหยุดทั้งหมด (`/holidays`)**: แสดงรายการวันหยุดทั้งหมดที่จัดกลุ่มตามเดือน.

## การปรับแต่ง

- **API Key**: แก้ไขไฟล์ .env เพื่อเพิ่ม API Key ของคุณ.
- **CSS**: ปรับแต่งไฟล์ `styles.css` ในโฟลเดอร์ stylesheets เพื่อเปลี่ยนธีม.

## Dependencies

- [Express](https://expressjs.com/) - Framework สำหรับ Node.js
- [Axios](https://axios-http.com/) - ใช้สำหรับดึงข้อมูลจาก API
- [dotenv](https://github.com/motdotla/dotenv) - จัดการ Environment Variables

## การพัฒนา

1. **รันเซิร์ฟเวอร์ในโหมดพัฒนา:**

   ```bash
   npm run dev
   ```

   ใช้ `nodemon` เพื่อรีโหลดเซิร์ฟเวอร์อัตโนมัติเมื่อมีการเปลี่ยนแปลงไฟล์.

2. **แก้ไขไฟล์ View:**

   - แก้ไขไฟล์ `.ejs` ในโฟลเดอร์ views เพื่อปรับแต่ง UI.

3. **แก้ไข CSS:**
   - แก้ไขไฟล์ `styles.css` ในโฟลเดอร์ stylesheets เพื่อปรับแต่งสไตล์.
