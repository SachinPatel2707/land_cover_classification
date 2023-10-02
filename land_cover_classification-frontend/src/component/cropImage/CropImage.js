import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import image1 from "./image2.png"
import test_img from '../../images/test.png';
import test_img1 from '../../images/test1.png';
import test_img2 from '../../images/image2.jpg';
import './CropImage.css'
import { connect, useDispatch } from "react-redux";
import http_service from '../../services/http';

const CropImage = (props) => {

  const [srcImg, setSrcImg] = useState(image1);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [result, setResult] = useState(null);

  const getCroppedImg = async () => {
    try {
      if (!image) {
        console.log("Image not loaded yet");
        return;
      }
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const scale = 1;
      canvas.width = crop.width * scale * 2;
      canvas.height = crop.height * scale * 2;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scale * 2,
        crop.height * scale * 2
      );


      const base64Image = canvas.toDataURL("image/png", 1.0);
      setResult(base64Image);
    } catch (e) {
      console.log("Error cropping the image:", e);
    }
  };

  const onLoad = (img) => {
    setImage(img);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(result);
  };

  const downloadImage = () => {
    if (!result) {
      console.log("No cropped image found");
      return;
    }
    const byteString = atob(result.split(",")[1]);
    const mimeString = result.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cropped-image.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const classify = () => {
    props.blockUI.start('Analysing...')
    new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
      const data = {'image': result}
      http_service.make_post_call('analyse',  data)
      .then((data) => {
        console.log('response from post call');
        console.log(data)
        props.set_pred_percent(data['result'])
        props.set_cropped_img(result)
        props.set_pred_mask(data['mask'])
        props.blockUI.end();
        props.setViewToMap([false, false, true, false]);
      })
    });
  }

  return (
    <div className="crop-container">
      <div id='parent-grid'>
        <div id='heading'>
          <h6>Select a part of image for analysis and click <b>Confirm</b> to proceed</h6>
        </div>
        <div id='uncropped-img' className='image'>
          {srcImg && (
              <div style={{ width: "100%", height: "100%" }}>
                <ReactCrop
                  style={{ width: "100%", height: "100%" }}
                  crop={crop}
                  onChange={(new_crop) => {
                    setCrop(new_crop);
                    getCroppedImg();
                  }}
                >
                  { !props.use_test_img && <img crossOrigin='anonymous' src={props.img_url} onLoad={e => onLoad(e.target)} />}
                  { props.use_test_img && <img crossOrigin='anonymous' src={test_img} onLoad={e => onLoad(e.target)} />}
                </ReactCrop>
                {/* <button className="cropButton" onClick={getCroppedImg}>
                  crop
                </button> */}
              </div>
            )}
        </div>
        <div id='cropped-img' className='image flex-center'>
          {result && (
            <div className='flex-center' style={{ width: "100%", height: "90%" }}>
              <img src={result} alt="cropped image" />
            </div>
          )}
          <div className='flex-center' style={{ width: "100%", height: "10%" }}>
            <div className="my-btn flex-center" onClick={classify}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
      coords : state.selected_coordinates,
      img_url: state.sat_img_url,
      use_test_img: state.use_test_img,
  }
}

const mapDispatchToProps = (dispatch) => {
  return  {
      set_coords: (coords) => dispatch({ type: "set_coordinates", payload: coords}),
      set_sat_img_url: (url) => dispatch({ type: "set_sat_img_url", payload: url}),
      set_cropped_img: (img) => dispatch({type: "set_cropped_img", payload: img}),
      set_pred_mask: (img) => dispatch({type: "set_pred_mask", payload: img}),
      set_pred_percent: (data) => dispatch({type: "set_pred_percent", payload: data}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CropImage);

