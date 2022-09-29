import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation/Navbar";
import AddNewCategory from "./pages/Categories/AddNewCategory";
import CategoryList from "./pages/Categories/CategoryList";
import DetailsCategory from "./pages/Categories/DetailsCategory";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import AdminRoute from "./protectRoute/AdminRoute";

function App() {
  // console.log(import.meta.env.VITE_MY_KEY);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AdminRoute />}>
          <Route path="/add-category" element={<AddNewCategory />} />
          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/detail-category/:id" element={<DetailsCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
