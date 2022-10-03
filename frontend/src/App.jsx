import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigation/Navbar";
import AddNewCategory from "./pages/Categories/AddNewCategory";
import CategoryList from "./pages/Categories/CategoryList";
import DetailsCategory from "./pages/Categories/DetailsCategory";
import HomePage from "./pages/HomePage/HomePage";
import CreatePost from "./pages/Post/CreatePost";
import EditPost from "./pages/Post/EditPost";
import PostDetails from "./pages/Post/PostDetails";
import PostList from "./pages/Post/PostList";
import Login from "./pages/User/Login";
import Profile from "./pages/User/Profile";
import Register from "./pages/User/Register";
import AdminRoute from "./protectRoute/AdminRoute";
import PrivateRoute from "./protectRoute/PrivateRoute";

import "react-responsive-modal/styles.css";
import UploadProfilePhoto from "./pages/User/UploadProfilePhoto";
import UpdateProfileForm from "./pages/User/UpdateProfileForm";
import SendMail from "./pages/User/SendMail";

function App() {
  // console.log(import.meta.env.VITE_MY_KEY);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/post/:id" element={<PostDetails />} />

        <Route element={<PrivateRoute />}>
          <Route
            path="/upload-profile-photo"
            element={<UploadProfilePhoto />}
          />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfileForm />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/send-mail" element={<SendMail />} />
          <Route path="/add-category" element={<AddNewCategory />} />
          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/detail-category/:id" element={<DetailsCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
