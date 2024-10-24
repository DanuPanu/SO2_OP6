import { Container } from "@mui/material";
import Uutiset from './components/Uutiset'
import YlaPalkki from './components/YlaPalkki'
import { Route, Routes } from "react-router-dom";
import Kommentit from "./components/Kommentit";
import Login from "./components/Login";
import Rekisteröidy from "./components/Rekisteröidy";
import { useState } from "react";

const App : React.FC = () : React.ReactElement => {

  const [token, setToken] = useState<string>("");

  const [nakyy, setNakyy] = useState<any>("block"); 

 return (
  <Container>
    <YlaPalkki></YlaPalkki>
    <Uutiset token={token} nakyy={nakyy}></Uutiset>
    <Routes>
      <Route path="/kaikki" element={<Kommentit token={token}/>}/>
      <Route path="/rekisteröidy" element={<Rekisteröidy token={token}/>}/>
      <Route path="/login" element={<Login setToken={setToken} setNakyy={setNakyy}/>}/>
    </Routes>
  </Container>
 )

};
export default App;
