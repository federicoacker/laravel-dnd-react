import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login"
import { UserProvider } from "./contexts/UserContext";
import Register from "./pages/auth/Register";
import Characters from "./pages/Characters";
import { FilterProvider } from "./contexts/FilterContext";
import Character from "./pages/Character";
import CharacterCreate from "./pages/CharacterCreate";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <FilterProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/characters/:id" element={<Character />} />
              <Route path="/newCharacter" element={<CharacterCreate/>}/>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </FilterProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
export default App;
