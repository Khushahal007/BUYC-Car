import React from "react";
import Auth from "./Components/Auth/Auth"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Components/Homepage/Home";
import Data from "./Components/Filter/Data";




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/home' element={<Home />} />
          {/* <Route path='/' element={<Data />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
