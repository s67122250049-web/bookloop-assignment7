/*
  ข้อมูลหนังสือ (id, title, author, category, publisher, year, quantityTotal,
  quantityAvailable) นำมาจาก Book Master Dataset ของโครงงานจริง (งาน 5)
  ฟิลด์ rating และ description ไม่มีอยู่ในเอกสารต้นฉบับ จึงเป็น
  // Mock data for prototype ตามที่ระบุไว้ในสเปก
*/
export const books = [
  {
    id: "B001",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    publisher: "Bloomsbury",
    year: 1997,
    quantityTotal: 5,
    quantityAvailable: 4,
    status: "Available",
    rating: 4.8, // Mock data for prototype
    description:
      "เด็กชายที่ไม่รู้ว่าตัวเองเป็นพ่อมด ได้รับจดหมายเชิญเข้าเรียนที่ฮอกวอตส์ และต้องเผชิญกับความลับของศิลาอาถรรพ์", // Mock data for prototype
    rentalDays: 14, // Mock data for prototype
    lateFeePerDay: 10, // Mock data for prototype
    cover: "/images/books/book_001_thumb.svg",
  },
  {
    id: "B002",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    publisher: "George Allen & Unwin",
    year: 1937,
    quantityTotal: 5,
    quantityAvailable: 3,
    status: "Available",
    rating: 4.7, // Mock data for prototype
    description:
      "การผจญภัยของบิลโบ แบ๊กกิ้นส์ ฮอบบิทตัวเล็กที่ถูกดึงเข้าสู่การเดินทางอันยิ่งใหญ่เพื่อทวงคืนขุมทรัพย์จากมังกร", // Mock data for prototype
    rentalDays: 14, // Mock data for prototype
    lateFeePerDay: 10, // Mock data for prototype
    cover: "/images/books/book_002_thumb.svg",
  },
  {
    id: "B003",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    publisher: "Secker & Warburg",
    year: 1949,
    quantityTotal: 4,
    quantityAvailable: 2,
    status: "Available",
    rating: 4.9, // Mock data for prototype
    description:
      "โลกดิสโทเปียภายใต้การปกครองของพรรคที่สอดส่องทุกความคิด เรื่องราวของวินสตัน สมิธ ผู้ตั้งคำถามต่อระบบ", // Mock data for prototype
    rentalDays: 10, // Mock data for prototype
    lateFeePerDay: 10, // Mock data for prototype
    cover: "/images/books/book_003_thumb.svg",
  },
  {
    id: "B004",
    title: "Animal Farm",
    author: "George Orwell",
    category: "Fiction",
    publisher: "Secker & Warburg",
    year: 1945,
    quantityTotal: 4,
    quantityAvailable: 4,
    status: "Available",
    rating: 4.6, // Mock data for prototype
    description:
      "นิทานเปรียบเปรยการเมืองผ่านฟาร์มสัตว์ที่ลุกขึ้นปฏิวัติเจ้าของฟาร์ม แล้วกลายเป็นระบอบใหม่ที่ไม่ต่างจากเดิม", // Mock data for prototype
    rentalDays: 10, // Mock data for prototype
    lateFeePerDay: 10, // Mock data for prototype
    cover: "/images/books/book_004_thumb.svg",
  },
  {
    id: "B005",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Children",
    publisher: "Reynal & Hitchcock",
    year: 1943,
    quantityTotal: 5,
    quantityAvailable: 5,
    status: "Available",
    rating: 4.9, // Mock data for prototype
    description:
      "เรื่องราวของเจ้าชายน้อยจากดาวเคราะห์ดวงเล็ก ที่ออกเดินทางเรียนรู้ความหมายของมิตรภาพและความรัก", // Mock data for prototype
    rentalDays: 14, // Mock data for prototype
    lateFeePerDay: 10, // Mock data for prototype
    cover: "/images/books/book_005_thumb.svg",
  },
];

// หมวดหมู่หนังสือ 8 รายการ อ้างอิงจากชีต Categories ในไฟล์ข้อมูลของโครงงาน
export const categories = [
  { id: "C001", name: "Fantasy", th: "แฟนตาซี", icon: "/images/categories/fantasy.svg" },
  { id: "C002", name: "Fiction", th: "นวนิยาย", icon: "/images/categories/fiction.svg" },
  { id: "C003", name: "Children", th: "หนังสือเด็ก", icon: "/images/categories/children.svg" },
  { id: "C004", name: "Education", th: "การศึกษา", icon: "/images/categories/education.svg" },
  { id: "C005", name: "Business", th: "ธุรกิจ", icon: "/images/categories/business.svg" },
  { id: "C006", name: "History", th: "ประวัติศาสตร์", icon: "/images/categories/history.svg" },
  { id: "C007", name: "Science", th: "วิทยาศาสตร์", icon: "/images/categories/science.svg" },
  { id: "C008", name: "Romance", th: "โรแมนซ์", icon: "/images/categories/romance.svg" },
];

/*
  ข้อมูลสมาชิก M001–M003 นำมาจากชีต Members (ข้อมูลตัวอย่างสำหรับทดสอบระบบ
  ตามที่ระบุไว้ในเอกสารโครงงานอยู่แล้ว) เพิ่มฟิลด์ phone / joinDate / avatarColor
  ที่ไม่มีในเอกสารต้นฉบับเป็น // Mock data for prototype
*/
export const members = [
  {
    id: "M001",
    studentStaffId: "67122250001",
    name: "สมชาย ใจดี",
    email: "member001@example.com",
    phone: "081-234-5601", // Mock data for prototype
    status: "Active",
    joinDate: "2026-06-01", // Mock data for prototype
    borrowingCount: 1,
  },
  {
    id: "M002",
    studentStaffId: "67122250002",
    name: "สมศรี รักเรียน",
    email: "member002@example.com",
    phone: "081-234-5602", // Mock data for prototype
    status: "Active",
    joinDate: "2026-06-10", // Mock data for prototype
    borrowingCount: 1,
  },
  {
    id: "M003",
    studentStaffId: "67122250003",
    name: "กิตติ พัฒนา",
    email: "member003@example.com",
    phone: "081-234-5603", // Mock data for prototype
    status: "Active",
    joinDate: "2026-06-15", // Mock data for prototype
    borrowingCount: 1,
  },
];

/*
  ข้อมูลการเช่า R001–R004 นำมาจากชีต Rentals ในเอกสารโครงงาน (ข้อมูลตัวอย่าง
  สำหรับทดสอบระบบ) ฟิลด์ fine เป็น // Mock data for prototype เนื่องจากเอกสาร
  ต้นฉบับไม่ได้ระบุค่าปรับไว้
*/
export const rentals = [
  {
    id: "R001",
    memberId: "M001",
    bookId: "B001",
    rentalDate: "2026-08-01",
    dueDate: "2026-08-15",
    returnDate: "2026-08-12",
    status: "Returned",
    fine: 0,
  },
  {
    id: "R002",
    memberId: "M002",
    bookId: "B002",
    rentalDate: "2026-08-05",
    dueDate: "2026-08-19",
    returnDate: null,
    status: "Rented",
    fine: 0,
  },
  {
    id: "R003",
    memberId: "M003",
    bookId: "B003",
    rentalDate: "2026-08-10",
    dueDate: "2026-08-24",
    returnDate: "2026-08-23",
    status: "Returned",
    fine: 0,
  },
  {
    id: "R004",
    memberId: "M001",
    bookId: "B004",
    rentalDate: "2026-08-15",
    dueDate: "2026-08-29",
    returnDate: null,
    status: "Overdue", // Mock data for prototype — สมมติให้เกินกำหนดเพื่อสาธิต UI สถานะ
    fine: 40, // Mock data for prototype
  },
];

// ผู้ใช้งานตัวอย่างที่ "เข้าสู่ระบบ" อยู่ใน Prototype นี้ (ไม่ใช่ Authentication จริง)
export const currentMember = members[0]; // Mock data for prototype
