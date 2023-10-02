import React from 'react'
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css';


const Slider = ({ images }) => {
    return (
        <Carousel  fade>
            {images.map((image, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={image}
                        alt={`Slide ${index + 1}`}
                        style={{ width: "500px", height: "600px" }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default Slider


/* import React, { useState, useEffect } from 'react';

const Slider = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((activeIndex + 1) % props.images.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [activeIndex, props.images]);

    return (
        <div className="slider">
            <img src={props.images[activeIndex]} alt="slider" />
        </div>
    );
}

export default Slider */
