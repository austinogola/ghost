

function Navbar(props) {
  return (
    <nav className='navbar' >
          <span><a href="/" scroll={true}>GhostMail</a></span>
          <ul>
              {(props.showAll || props.showHome) && <li><a href="/" scroll={true}>Home</a></li>}
              {( props.showAll || props.showProduct) && <li><a href="#product" scroll={true}>Product</a></li> }
              {
              (props.loginBtn && <li><button><a href="/login">Login</a></button></li>) 
                ||
               <li><button><a href="/join">Get Started</a></button></li>
               }
             

          </ul>
      
      </nav>
     

  );
}

export default Navbar;