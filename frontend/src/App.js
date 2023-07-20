import './App.css';

import {Route, Routes } from "react-router-dom";
import Chatpage from './pages/Chatpage';
import Signup from './components/Signup';
import Login from './components/Login';
import Test from './components/Test';
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Signup/>} exact />
      <Route path="/login" element={<Login/>} exact/>
      <Route path="/chats" element={<Chatpage/>} />
      </Routes>
    </div>
  );
}

export default App;
