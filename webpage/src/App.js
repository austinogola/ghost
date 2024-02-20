import Home from './pages/home';
import Policy from './pages/policy';
import ToS from './pages/tos';
import Join from './pages/join';
import { BrowserRouter , Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/privacy-policy" element={<Policy />}/>
      <Route path="/terms-of-service" element={<ToS />}/>
      <Route path="/join" element={<Join />}/>
    </Routes>

    
  );
}

export default App;
