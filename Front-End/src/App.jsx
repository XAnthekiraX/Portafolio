import './App.css';
import { Routes, Route } from "react-router-dom";
import PageInitial from './Components/PageInitial';
import SkillAndProject from './Components/SkillAndProject';
import LoginDeveloper from './LoginDevSection/Components/LoginDeveloper'
function App() {

  const loginStatus = true;

  return (
    <Routes>
      {/* Ruta raíz (inicio) */}
      <Route path="/" element={<PageInitial />} />
      {/* Ruta para el login */}
      {
        loginStatus 
          ?
          <Route path="/login" element={<SkillAndProject />} />
          :
          <Route path="/login" element={<LoginDeveloper/>} />
      }
    </Routes>
  );
}




export default App;
