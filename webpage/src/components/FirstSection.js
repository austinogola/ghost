import composeBox from '../Images/compose_box_scrnshot.png';

function FirstSection() {
    return (
      <section className='firstSection' id='home'>
        <div className='textParent'>
          <div className='textDiv'>
            <h1>More time for the conversations that matter to you.</h1>
            <p>From small talk to big asks, we've got you covered. Enter the specifics of what you need to say and let us do the talking for you.</p>
            <button>Get Started for Free</button>
            <div className='featureDiv'>
              <span></span>
            </div>

            <div className='featureDiv'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className='animationDiv'>
          <div>
          <img src={composeBox} className="compose_box" alt="compose_box" />
          </div>
           
        </div>
        </section>
       
  
    );
  }
  
  export default FirstSection;