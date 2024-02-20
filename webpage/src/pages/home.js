import Navbar from '../components/Navbar';
import FirstSection from '../components/FirstSection';
import './App.css';

const Home=()=>{
    return(
        <div className='main Home'>
            <Navbar showAll={true}/>
            <FirstSection/>

        </div>
    )
}


export default Home;