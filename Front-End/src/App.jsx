import './App.css';
import { Routes, Route } from "react-router-dom";
import PageInitial from './Components/PageInitial';
import LoginDeveloper from './Components/LoginDeveloper';
// import AddNewSkill from './Common/AddSkills/AddNewSkill';
import SkillAndProject from './Components/SkillAndProject';

function App() {
  const login = true;

  return (
    <Routes>
      {/* Ruta raíz (inicio) */}
      <Route path="/" element={<PageInitial />} />
      {/* Ruta para el login */}
      {
        login
          ?
          <Route path="/login" element={<SkillAndProject />} />
          :
          <Route path="/login" element={<LoginDeveloper />} />
      }
    </Routes>
  );
}

export default App;
