import React from 'react'
import "../home/Introduction.css"
import image from './image1.jpg';


const Introduction = () => {
  return (
    <div className='intro'>
      <div className = 'intro-image'>
        <img src = {image} id='intro-image'></img>
      </div>
      <div className = 'intro-text'>
        Welcome to our Land Cover Classification website. Our website offers a comprehensive overview of different land cover types, from forests and grasslands to urban and agricultural areas.
        Our website uses a combination of satellite imagery data and machine learning algorithms to map and classify different land cover types, creating detailed and accurate maps for environmental management and conservation efforts.
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        An example of classification of satellite image.
      </div>
    </div>
  )
}

export default Introduction