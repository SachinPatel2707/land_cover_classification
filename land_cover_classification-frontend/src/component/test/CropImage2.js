import React, { useState } from "react";
import './CropImage.css'
import { connect, useDispatch } from "react-redux";
import http_service from '../../services/http';

const ImageUpload = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setSelectedImage(image);
    convertImageToBase64(image);
  };

  const convertImageToBase64 = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      props.set_uncropped_img(reader.result);
      props.set_use_test_img(false);
      props.setViewToMap([false, false, false, true]);
    };
  };

  return (
    <div class="crop-container flex-center" id="input-upload">
        <p>Select an image that you want to use for classification : </p>  
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {/* {selectedImage && <img id="upload-preview" src={URL.createObjectURL(selectedImage)} alt="Selected" />} */}
    </div>
  );
};

const mapStateToProps = (state) => {
    return {
        coords : state.selected_coordinates,
        img_url: state.sat_img_url,
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return  {
        set_uncropped_img: (img) => dispatch({type: "set_uncropped_img", payload: img}),
        set_use_test_img: (val) => dispatch({ type: "set_use_test_img", payload: val}),
    }
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload);
