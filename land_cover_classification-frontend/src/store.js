import { legacy_createStore as createStore } from "redux";

const initialState = { 
    selected_coordinates : {},
    sat_img_url: '',
    cropped_img: '',
    uncropped_img: '',
    pred_mask: '',
    pred_percent: {},
    use_test_img: false,
 };

function reducer(state = initialState, action) {
  switch (action.type) {
    case "set_coordinates":
      return { 
        ...state,
        selected_coordinates: action.payload,
     };
    case "set_sat_img_url":
      return {
        ...state,
        sat_img_url: action.payload,
      }
    case "set_cropped_img":
        return {
          ...state,
          cropped_img: action.payload,
        }
    case "set_pred_mask":
        return {
          ...state,
          pred_mask: action.payload,
        }
    case "set_pred_percent":
        return {
          ...state,
          pred_percent: action.payload,
        }
    case "set_uncropped_img":
        return {
          ...state,
          sat_img_url: action.payload,
        }
    case "set_use_test_img":
        return {
          ...state,
          use_test_img: action.payload,
        }
    default:
      return state;
  }
}

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()))

export default store;
