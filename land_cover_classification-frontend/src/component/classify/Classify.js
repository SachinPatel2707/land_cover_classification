import React from 'react'
import "./Classify.css"
import image1 from './image1.jpg';
import image2 from './image2.jpg';
import image3 from './image3.png';
import JsPDF from 'jspdf';

const Classify = () => {
  return (
    <div className='parent'>
        <div className='child1'>
        <img src={image1} alt="Image 1" />
        </div>
        <div className='child2'>
        <img src={image2} alt="Image 2" />
        </div>
        <div className='child3'>
        <img src={image3} alt="Image 3" />
        </div>
        <div className='child4'>
        
        </div>
    </div>
  )
}

export default Classify