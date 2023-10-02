import React, {useState} from 'react';
import Modal from '../modal/Modal';
import "./Navbar.css";
import eventBus from '../eventBus/EventBus';
import image from '../../images/image.jpg';
import http_service from '../../services/http';
import { connect, useDispatch } from "react-redux";
import test_img from '../../images/test.png';


const Navbar = (props) => {
    // const goToCurrentLocation = () => {
    //     eventBus.emit('goToCurLoc', 'Hello from navbar');
    // }

    const onSubmit = () => {
        props.blockUI.start('Fetching Satellite Image...');
        new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
          const data = {
            'selected_coordinates': props.selected_coordinates
          } 
          http_service.make_post_call('get_satellite_image',  data)
          .then((data) => {
            console.log('response from post call');
            props.set_sat_img_url(data.img_url);
            // props.set_sat_img_url(URL.createObjectURL(test_img));
            props.set_use_test_img(true);
            props.blockUI.end();
            props.setViewToMap([false, false, false, true]);
          })
        });
    }

    return (
        <div className='custom-navbar'>
            <div className = 'nav-logo'>
                <img src={image} className = 'nav-logo-image'></img>
            </div>
            <div className = 'nav-title'>
                Land Cover Classification
            </div>
            <div className = 'nav-menu'>
                <div className = 'custom-navbar-item' onClick={() => props.setViewToMap([true, false, false, false])}>
                    Home
                </div>
                <div className = 'custom-navbar-item' onClick={() => props.setViewToMap([false, true, false, false])}>
                    Map
                </div>
                <div className = 'custom-navbar-item' onClick={() => props.setViewToMap([false, false, false, false, true])}>
                    Upload
                </div>
                {props.currentShowMenu[1] && <div className = 'custom-navbar-item' onClick={onSubmit}>
                    Submit
                </div>}
                {/* <div className = 'custom-navbar-item' onClick={goToCurrentLocation}>
                    {isButtonClicked ? 'Reset Map' : 'Current Location'}
                </div> */}
                {/* <div className = 'custom-navbar-item' onClick={() => props.setOpenInstructions(true)}>
                    Instructions
                </div> */}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({ 
    selected_coordinates: state.selected_coordinates,
    img_url: state.sat_img_url, 
});

const mapDispatchToProps = (dispatch) => {
    return  {
        set_coords: (coords) => dispatch({ type: "set_coordinates", payload: coords}),
        set_sat_img_url: (url) => dispatch({ type: "set_sat_img_url", payload: url}),
        set_use_test_img: (val) => dispatch({ type: "set_use_test_img", payload: val}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
