
import './App.css';
import HomePage from './components/HomePage';
import WelcomePage from './components/WelcomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/homepage" element={<HomePage/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
