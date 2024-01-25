import './App.css';
import { Outlet } from "react-router-dom";
import CustomNavbar from "./components/custom-navbar";
function App() {
  return (
    <>
      <CustomNavbar />  
       <Outlet />
    </>
  );
}

export default App;
