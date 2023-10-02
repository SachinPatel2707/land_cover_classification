import React from 'react'
import "../home/Team.css"
import image1 from "./neerajSir.jpg";
import image2 from "./mukeshSir.jpg";
import image3 from "./karan.jpg";
import image4 from "./nitin.jpg";
import image5 from "./sachin.jpg";
import image6 from "./saksham.jpg";

const Team = () => {
    return (
        <div className='team-main'>
            <div className='team-container'>
                <div className='heading'>
                    <h1>Our Team</h1>
                </div>
                    <div className='mukesh_sir mentors'>
                        <div className='mentorImage'>
                            <img src={image2} alt="Image 2" className = "round-img"/>
                        </div>
                        <div className='content'>
                            <h4>Dr. Mukesh Saini</h4>
                            <p>Assistant Professor <br/>
                                IIT Ropar, Punjab <br/><br/>     
                                Domain Director <br/>
                                iHub - AWaDH @ IIT Ropar</p>
                        </div>
                    </div>
                    <div className='neeraj_sir mentors'>
                        <div className='mentorImage'>
                            <img src={image1} alt="Image 1" className = "round-img"/>
                        </div>
                        <div className='content'>
                            <h4>Dr. Neeraj Goel</h4>
                            <p>Assistant Professor <br/> IIT Ropar, Punjab <br/><br/> Co-principal Director <br/>Agriculture &
                                Water Technology Development Hub <br/> AWaDH @ IIT Ropar</p>
                        </div>
                    </div>
                    <div className='karan students'>
                        <div className='studentImage'>
                            <img src={image3} alt="Image 2" className = "round-img"/>
                        </div>
                        <div className='content'>
                            <h5>Karan Singh</h5>
                            <p>Masters in Computer Science and Engineering, <br/>IIT Ropar, Punjab</p>
                        </div>
                    </div>
                    <div className='nitin students'>
                        <div className='studentImage'>
                            <img src={image4} alt="Image 2" className = "round-img"/>
                        </div>
                        <div className='content'>
                            <h5>Nitin Singhal</h5>
                            <p>Masters in Computer Science and Engineering, <br/>IIT Ropar, Punjab</p>
                        </div>
                    </div>
                    <div className='sachin students'>
                        <div className='studentImage'>
                            <img src={image5} alt="Image 2" className = "round-img"/>
                        </div>
                        <div className='content'>
                            <h5>Sachin Patel</h5>
                            <p>Masters in Computer Science and Engineering, <br/>IIT Ropar, Punjab</p>
                        </div>
                    </div>
                    <div className='saksham students'>
                        <div className='studentImage'>
                            <img src={image6} alt="Image 2" className = "round-img"/>
                        </div>
                        <div className='content'>
                            <h5>Saksham Srivastava</h5>
                            <p>Masters in Computer Science and Engineering, <br/>IIT Ropar, Punjab</p>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Team