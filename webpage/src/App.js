import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import FirstSection from './components/FirstSection';

function App() {
  return (
    <div className="App main">
      <Navbar/>
      <FirstSection/>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      
    </div>
  );
}

export default App;
