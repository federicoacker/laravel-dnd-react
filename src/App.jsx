import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login"
import { UserProvider } from "./contexts/UserContext";
import Register from "./pages/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element ={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
export default App;
