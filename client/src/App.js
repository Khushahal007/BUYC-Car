import React from "react";
import Auth from "./Components/Auth/Auth"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Components/Homepage/Home";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
