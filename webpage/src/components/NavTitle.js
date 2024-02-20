import Navbar from "./Navbar";

function NavTitle(props) {
    return (
      <div className='NavTitle' style={{backgroundColor:'#E39FF6',height:'fit-content',paddingBottom:'10px'}}>
        <Navbar showAll={props.showAll}/> 
        <h1 style={{textAlign:'center',fontSize:'30px',fontWeight:600}}>{props.title}</h1>
    </div>
       
  
    );
  }
  
  export default NavTitle;