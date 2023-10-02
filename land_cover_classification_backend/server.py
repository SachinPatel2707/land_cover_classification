from flask import Flask, jsonify, request, abort
from main import get_satellite_image
import time
from flask_cors import CORS, cross_origin
import cv2
import base64
import numpy as np
from model import *
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO


app = Flask(__name__)
CORS(app)

@app.route('/get_satellite_image', methods=['POST'])
def retrieve_image():
    print(request.json)
    if not request.json or not 'selected_coordinates' in request.json:
        abort(400)
    
    coords = request.json['selected_coordinates']
    lat1 = coords['lat1']
    lon1 = coords['lon1']
    lat2 = coords['lat2']
    lon2 = coords['lon2']

    query_param = [[
        [lon1, lat1],
        [lon1, lat2],
        [lon2, lat2],
        [lon2, lat1],
        [lon1, lat1]
    ]]

    url = get_satellite_image(query_param)    
    
    return jsonify({'img_url': url}), 201

@app.route('/analyse', methods=['POST'])
def analyse():
    if not request.json or not 'image' in request.json:
        abort(400)
    
    image_data = request.get_json()['image']
    # Convert the base64-encoded image data to a cv2 image
    encoded_data = image_data.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Display the image in a new window using cv2
    mask, classes = predict_mask(img)
    # cv2.imshow('Cropped Image', mask)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # plt.imshow(img)
    # plt.imshow(mask)
    # plt.show()

    # return jsonify({'success': True, 'result': classes, 'mask': mask.tolist()})  

    image = Image.fromarray(mask.astype('uint8')).convert('RGB')
    # create a BytesIO object to store the image
    img_io = BytesIO()
    # save the PIL Image object to the BytesIO object
    image.save(img_io, 'PNG')
    img_bytes = img_io.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    img_src = f"data:image/png;base64,{img_base64}"
    return jsonify({'success': True, 'result': classes, 'mask': img_src})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
