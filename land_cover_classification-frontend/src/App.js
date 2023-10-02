import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import Modal from './component/modal/Modal';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Map from './component/map/Map';
import Classify from './component/classify/Classify';
import Navbar from './component/navbar/Navbar';
import ExtractMap from './component/map/ExtractMap';
import Example from './component/classify/Example';
import Login from './component/login/Login';
import Register from './component/register/Register';
import Home from './component/home/Home';
import eventBus from './component/eventBus/EventBus';
import store from './store';
import Footer from './component/home/Footer';
import CropImage from './component/cropImage/CropImage';
import UploadImage from './component/test/CropImage2';
import BlockUI from './component/blockUI/BlockUI';

function App() {
  // 0-home, 1-map, 2-result, 3-cropImage
  const [show, setShow] = useState([true, false, false, false, false]);
  const [flag, setFlag] = useState(false);
  const [msg, setMsg] = useState('Loading...');
  const [user, setLoginUser] = useState({});
  const [isUIBlocked, setBlockUI] = useState(false);

  const startBlockUI = (msg) => {
    setMsg(msg);
    setBlockUI(true);
  }

  const endBlockUI = () => {
    setBlockUI(false);
  }

  const blockUI = {start: startBlockUI, end: endBlockUI};

  useEffect(() => {
    const showLogin = (msg) => {
        console.log(msg);
        {/* <Route exact path="/login" element={<Login setLoginUser={setLoginUser} />} ></Route> */}
    };
    eventBus.on('goToLogin', showLogin);

    return () => {
        eventBus.off('goToLogin', showLogin);
    };
}, []);

  return (
    <Provider store={store}>
      <div className='app'>
        <div className = 'container'>
          {/* <Router>
            <Routes>
              <Route exact path="/map" element={(user && user._id) ? <Map setLoginUser={setLoginUser} /> : <Login setLoginUser={setLoginUser}/>}></Route>
              <Route exact path="/" element={<Map setLoginUser={setLoginUser}/>} ></Route>
              <Route exact path="/login" element={<Login setLoginUser={setLoginUser} />} ></Route>
              <Route exact path="/register" element={<Register />}></Route>
              <Route exact path="/classify" element={<Example />}></Route>
            </Routes>
          </Router> */}
          { isUIBlocked && <BlockUI message={msg}/>}
          <Navbar setViewToMap={setShow} currentShowMenu={show} blockUI={blockUI}/>
          {show[0] && <Home />}
          {/* {show && <Modal setIsOpen={setShow} msgs={msgs} />} */}
          {show[1] && <Map setViewToMap={setShow} blockUI={blockUI} />}
          {show[2] && <Example />}
          {show[3] && <CropImage setViewToMap={setShow} blockUI={blockUI}/>}
          {show[4] && <UploadImage setViewToMap={setShow} blockUI={blockUI}/>}
          <Footer />
        </div>
      </div>
    </Provider>
  );
}

export default App;
