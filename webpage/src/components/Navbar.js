
function Navbar() {
  return (
    <nav className='navBar' >
          <ul>
            <li><a href="#home" scroll={true}>Logo</a></li>
            <li><a href="#home" scroll={true}>Home</a></li>
            <li><a href="#product" scroll={true}>Product</a></li>
            <li><button>Get Started</button></li>
          </ul>
           {/* <img src={logo} className="Navbar-logo" alt="logo" /> */}
      </nav>
     

  );
}

export default Navbar;