import { Routes, Route } from "react-router-dom";

import FrontLayout from "./layouts/FrontLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Front Office
import Home from "./pages/front/Home.jsx";
import BookCatalog from "./pages/front/BookCatalog.jsx";
import BookDetail from "./pages/front/BookDetail.jsx";
import Login from "./pages/front/Login.jsx";
import Register from "./pages/front/Register.jsx";
import MemberDashboard from "./pages/front/MemberDashboard.jsx";
import MyRentals from "./pages/front/MyRentals.jsx";
import RentalHistory from "./pages/front/RentalHistory.jsx";
import FeedbackPage from "./pages/front/FeedbackPage.jsx";

// Back Office (Admin)
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import BookManagement from "./pages/admin/BookManagement.jsx";
import MemberManagement from "./pages/admin/MemberManagement.jsx";
import RentalManagement from "./pages/admin/RentalManagement.jsx";
import ReturnManagement from "./pages/admin/ReturnManagement.jsx";
import FeedbackResults from "./pages/admin/FeedbackResults.jsx";

function App() {
  return (
    <Routes>
      {/* Front Office — สำหรับสมาชิกและผู้ใช้งานทั่วไป */}
      <Route element={<FrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookCatalog />} />
        <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/rentals" element={<MyRentals />} />
          <Route path="/member/history" element={<RentalHistory />} />
          <Route path="/member/feedback" element={<FeedbackPage />} />
        </Route>
      </Route>

      {/* Back Office — สำหรับผู้ดูแลร้าน (Admin) */}
      <Route element={<ProtectedRoute adminOnly />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<BookManagement />} />
        <Route path="/admin/members" element={<MemberManagement />} />
        <Route path="/admin/rentals" element={<RentalManagement />} />
        <Route path="/admin/returns" element={<ReturnManagement />} />
        <Route path="/admin/feedback" element={<FeedbackResults />} />
        
      </Route>
      </Route>
      <Route path="*" element={<div className="page-header"><h1>ไม่พบหน้าที่ต้องการ</h1><a href="/">กลับหน้าแรก</a></div>} />
    </Routes>
  );
}

export default App;
