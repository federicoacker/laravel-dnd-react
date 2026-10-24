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
import Races from "./pages/Races";
import Backgrounds from "./pages/Backgrounds";
import Classes from "./pages/Classes";
import Features from "./pages/Features";
import Feats from "./pages/Feats";
import Proficiencies from "./pages/Proficiencies";
import Spells from "./pages/Spells";
import BackgroundShow from "./pages/show/BackgroundShow";
import ClassShow from "./pages/show/ClassShow";
import RaceShow from "./pages/show/RaceShow";
import FeatureShow from "./pages/show/FeatureShow";
import FeatShow from "./pages/show/FeatShow";
import SpellShow from "./pages/show/SpellShow";
import Profile from "./pages/auth/Profile";

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
              <Route path="/races" element={<Races/>}/>
              <Route path="/races/:id" element={<RaceShow/>}/>
              <Route path="/backgrounds" element={<Backgrounds/>}/>
              <Route path="/backgrounds/:id" element={<BackgroundShow/>}/>
              <Route path="/classes" element={<Classes/>}/>
              <Route path="/classes/:id" element={<ClassShow/>}/>
              <Route path="/features" element={<Features/>}/>
              <Route path="/features/:id" element={<FeatureShow />}/>
              <Route path="/feats" element={<Feats/>}/>
              <Route path="/feats/:id" element={<FeatShow/>}/>
              <Route path="/proficiencies" element={<Proficiencies/>}/>
              <Route path="/spells" element={<Spells/>}/>
              <Route path="/spells/:id" element={<SpellShow/>}/>
              <Route path="/profiles/:id" element={<Profile/>}/>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </FilterProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
export default App;
