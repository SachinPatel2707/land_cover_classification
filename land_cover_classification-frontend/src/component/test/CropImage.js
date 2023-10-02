import React, { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import image1 from "./image2.png"
import test_img from '../../images/test.png';
import './CropImage.css'
import { connect, useDispatch } from "react-redux";

// const CropImage = (props) => {

//   const [srcImg, setSrcImg] = useState(image1);
//   const [image, setImage] = useState(null);
//   const [crop, setCrop] = useState({ aspect: 1 / 1 });
//   const [result, setResult] = useState(image1);

//   const getCroppedImg = async () => {
//     try {
//       if (!image) {
//         console.log("Image not loaded yet");
//         return;
//       }
//       const canvas = document.createElement("canvas");
//       const scaleX = image.naturalWidth / image.width;
//       const scaleY = image.naturalHeight / image.height;
//       const scale = 1;
//       canvas.width = crop.width * scale * 2;
//       canvas.height = crop.height * scale * 2;

//       const ctx = canvas.getContext("2d");
//       ctx.imageSmoothingQuality = "high";
//       ctx.imageSmoothingEnabled = true;
//       ctx.drawImage(
//         image,
//         crop.x * scaleX,
//         crop.y * scaleY,
//         crop.width * scaleX,
//         crop.height * scaleY,
//         0,
//         0,
//         crop.width * scale * 2,
//         crop.height * scale * 2
//       );


//       const base64Image = canvas.toDataURL("image/jpeg");
//       setResult(base64Image);
//     } catch (e) {
//       console.log("Error cropping the image:", e);
//     }
//   };

//   const onLoad = (img) => {
//     setImage(img);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log(result);
//   };

//   const downloadImage = () => {
//     if (!result) {
//       console.log("No cropped image found");
//       return;
//     }
//     const byteString = atob(result.split(",")[1]);
//     const mimeString = result.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     const blob = new Blob([ab], { type: mimeString });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "cropped-image.jpeg";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const classify = () => {
//     props.blockUI.start('Analysing...')
//     new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
//       console.log('5 seconds have passed');
//       props.blockUI.end();
//       props.setViewToMap([false, false, true, false])
//     });
//   }

//   return (
//     <div className="crop-container">
//       <div id='parent-grid'>
//         <div id='heading'>
//           <h6>Select a part of image for analysis and click <b>Confirm</b> to proceed</h6>
//         </div>
//         <div id='uncropped-img' className='image'>
//           {srcImg && (
//               <div style={{ width: "100%", height: "100%" }}>
//                 <ReactCrop
//                   style={{ width: "100%", height: "100%" }}
//                   crop={crop}
//                   onChange={(new_crop) => {
//                     setCrop(new_crop);
//                     getCroppedImg();
//                   }}
//                 >
//                   {/* <img crossOrigin='anonymous' src={props.img_url} onLoad={e => onLoad(e.target)} /> */}
//                   <img crossOrigin='anonymous' src={test_img} onLoad={e => onLoad(e.target)} />
//                 </ReactCrop>
//                 {/* <button className="cropButton" onClick={getCroppedImg}>
//                   crop
//                 </button> */}
//               </div>
//             )}
//         </div>
//         <div id='cropped-img' className='image flex-center'>
//           {result && (
//             <div className='flex-center' style={{ width: "100%", height: "90%" }}>
//               <img src={result} alt="cropped image" />
//             </div>
//           )}
//           <div className='flex-center' style={{ width: "100%", height: "10%" }}>
//             <div className="my-btn flex-center" onClick={classify}>
//               Confirm
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//       coords : state.selected_coordinates,
//       img_url: state.sat_img_url,
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return  {
//       set_coords: (coords) => dispatch({ type: "set_coordinates", payload: coords}),
//       set_sat_img_url: (url) => dispatch({ type: "set_sat_img_url", payload: url})
//   }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(CropImage);

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CropImage = (props) => {
    const [src, setSrc] = useState(null);
    const [cropData, setCropData] = useState('#');
    const cropperRef = useRef(null);
    useEffect(() => {
        setSrc(test_img);
    }, []);

    const cropperOptions = {
        aspectRatio: 16 / 9,
        viewMode: 1,
        minCropBoxWidth: 400,
        minCropBoxHeight: 225,
        maxCropBoxWidth: 800,
        maxCropBoxHeight: 450,
        zoomable: true,
    };

    const handleCrop = () => {
        // const cropper = cropperRef.current;
        // setTimeout(() => {
        //     const canvas = cropper.getCroppedCanvas({
        //       maxWidth: 1920,
        //       maxHeight: 1080,
        //       imageSmoothingEnabled: false,
        //       imageSmoothingQuality: 'high',
        //     });
        //     setCropData(canvas.toDataURL());
        //   }, 5000);
    };

    return (
        <div>
            <Cropper
                src={src}
                ref={cropperRef}
                crop={handleCrop}
                dragMode={"move"}
                {...cropperOptions}
            />
            <button onClick={handleCrop}>Crop Image</button>
        </div>
    );

}

const mapStateToProps = (state) => {
  return {
      coords : state.selected_coordinates,
      img_url: state.sat_img_url,
  }
}

const mapDispatchToProps = (dispatch) => {
  return  {
      set_coords: (coords) => dispatch({ type: "set_coordinates", payload: coords}),
      set_sat_img_url: (url) => dispatch({ type: "set_sat_img_url", payload: url})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CropImage);