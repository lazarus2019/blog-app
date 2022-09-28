import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <div className="App">
        <div className="grid grid-cols-10 gap-2">
          <div className="bg-sky-50 aspect-square"></div>
          <div className="bg-sky-100 aspect-square"></div>
          <div className="bg-sky-200 aspect-square"></div>
          <div className="bg-sky-300 aspect-square"></div>
          <div className="bg-sky-400 aspect-square"></div>
          <div className="bg-sky-500 aspect-square"></div>
          <div className="bg-sky-600 aspect-square"></div>
          <div className="bg-sky-700 aspect-square"></div>
          <div className="bg-sky-800 aspect-square"></div>
          <div className="bg-sky-900 aspect-square"></div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
