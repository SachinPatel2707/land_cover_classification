
import firebase_admin
from firebase_admin import credentials, storage
from firebase_admin import firestore
import os
import requests
from pprint import pprint
from PIL import Image
import time
from io import BytesIO
from datetime import datetime, timedelta
from shapely.geometry import Polygon

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
bucket = storage.bucket('acps-project-backend.appspot.com')

PL_API_ENDPOINT = 'https://api.planet.com/data/v1'
PL_API_KEY = 'PLAKea75ef1ad0f24fcf88073d0eda6b04f0'
Image.MAX_IMAGE_PIXELS = None

url = 'https://storage.googleapis.com/acps-project-backend.appspot.com/Images/test_image.png?Expires=1768231104&GoogleAccessId=firebase-adminsdk-gr0xg%40acps-project-backend.iam.gserviceaccount.com&Signature=R3oJJmBFaUDmB8RPn%2B7CWWrqyv%2BPtjbd7v9ZH4CtuLcCwUYeIDgUs496tKuzfJh%2F5WN6KWjmcB2zol%2FNhadCCjtoYC6KIbkN%2BlhkSr8E7oXt2JMhqs3IOBW83uWJoFUFkEW4YHSfSRbvQlkCJuvoDWOEObSajPjRyptQaPgs6xjxxinq7PD%2BTdpGWfeBfur9QcXXd2ZqBWb2YdfqTiXuzkwBvPrr8OHizm6FVZ%2BbvFAtir5%2BKVZiZprvQoUXvFp2B%2Bo2XAJgddxcJt5dSfJU4SiA3jCdoteIPD5DubRY7bwowxEtS75jNkzwBB%2BoaCtAxM1EE1MNfjwxXtYS56hIyA%3D%3D'

small_url = 'https://storage.googleapis.com/acps-project-backend.appspot.com/Images/20230415_051557_03_24a4.png?Expires=1768230054&GoogleAccessId=firebase-adminsdk-gr0xg%40acps-project-backend.iam.gserviceaccount.com&Signature=dDyorNBDv9td1vLVG9j6tjs7G5fjpstYyb2W52fTEqgMCexljGxY522ocqWvazP14x8dlhs%2BheMmsC%2BBI2TGVWXb0mYXMlJliaEi%2FHH53fR7M1laiwxIvY%2B%2FRsiOUOG62W%2FoWvdRa1B3SNb5Jl3%2BW0fysXpBh%2B3NnFVWLOOl2GmT3iLWhGWSQS6hUOdRlr3NwImCNcsWJfCWMlwnqk0mU3HJiz5Qv0mDYF%2F%2FPiSMBJXosEXOvC63%2FZ1Gu%2BYwUC3VEOGMxovVTmxBCnzX7vFI66qzpRsBK1sVsW5B1Ed7goS5KmSC2PITLNrXun97%2FR2s%2BJM4mQm1DY6a2pQGqzTHxA%3D%3D'

def get_satellite_image(query_coordinate=None, date=None):
    return url
    search_params = get_search_params(query_coordinate, date)
    auth = (PL_API_KEY, '')
    search_headers = {'content-type': 'application/json'}

    search_url = "{}/quick-search".format(PL_API_ENDPOINT)
    search_response = requests.post(search_url, json=search_params, auth=auth, headers=search_headers)
    search_json = search_response.json()
    # pprint(search_json['features'][0])

    download_urls = [f["_links"]["assets"] for f in search_json["features"]]
    filenames = [f["id"] for f in search_json["features"]]
    coordinates = [f['geometry']['coordinates'] for f in search_json['features']]

    query = change_one_coordinate(query_coordinate)
    coordinates = change_coordinates(coordinates)
    idx = find_max_overlap(query, coordinates)

    download_url = download_urls[idx]
    filename = filenames[idx]

    item = requests.get(download_url, auth=auth)
    # pprint(item.json())
    item_activation_url = item.json()['ortho_visual']["_links"]["activate"]
    response = requests.post(item_activation_url, auth=auth)
    while response.status_code == 202:
        print('Fetching image...')
        time.sleep(10)
        response = requests.post(item_activation_url, auth=auth)
        
    item = requests.get(download_url, auth=auth)

    if response.status_code == 204:
        final_url = item.json()['ortho_visual']["location"]
        download_request = requests.get(final_url, auth=auth, stream=True)
            
        img = Image.open(BytesIO(download_request.content))
        
        bs = BytesIO()
        out = img.rotate(10)
        out.save(bs, 'png', quality=100)
        blob = bucket.blob('Images/' + filename + '.png')
        blob.upload_from_string(bs.getvalue(), content_type="image/png")
        img_url = blob.generate_signed_url(datetime.now() + timedelta(days=1000))

        db.collection('images').document(filename).set({'name': filename + '.png', 'url': img_url})
        print("File {} downloaded".format(filename))
        return img_url

def get_search_params(coordinates, date):
    # date_from = date
    # date_to = date

    current_datetime = datetime.now() - timedelta(days=1)
    date_from = current_datetime - timedelta(days=2*30)
    current_datetime = current_datetime.strftime('%Y-%m-%dT%H:%M:%SZ')
    date_from = date_from.strftime('%Y-%m-%dT%H:%M:%SZ')

    search_params = {
        "item_types":[
            "PSScene"
        ],
        "filter":{
            "type":"AndFilter",
            "config":[
                {
                    "type":"GeometryFilter",
                    "field_name":"geometry",
                    "config":{
                    "type":"Polygon",
                    "coordinates": coordinates
                    }
                },
                {
                    "type":"DateRangeFilter",
                    "field_name":"acquired",
                    "config":{
                    "gte": date_from,
                    "lte": current_datetime
                    }
                },
                {
                    "type":"RangeFilter",
                    "config":{
                    "gte":0,
                    "lte":0.01
                    },
                    "field_name":"cloud_cover"
                },
                {
                    "type":"PermissionFilter",
                    "config":[
                    "assets:download"
                    ]
                }
            ]
        }
    }

    return search_params

def find_max_overlap(p, polygons):
    max_overlap = 0
    p = Polygon(p)
    
    # Check for intersection with each polygon
    for i, poly_coords in enumerate(polygons):
        poly = Polygon(poly_coords)
        if poly.intersects(p):
            # Calculate area of intersection
            overlap = poly.intersection(p).area
            if overlap > max_overlap:
                max_overlap = overlap

    return i

def change_one_coordinate(p):
    res = []
    for q in p[0]:
        x = q[0]
        y = q[1]
        res.append((x, y))
    return res

def change_coordinates(p):
    res = []
    for q in p:
        res.append(change_one_coordinate(q))
    return res

# lat1 = 30.945224649091216
# lon1 = 76.50601542475157
# lat2 = 30.993208586415832
# lon2 = 76.4308153128237
# query_param = [[
#     [lon1, lat1],
#     [lon1, lat2],
#     [lon2, lat2],
#     [lon2, lat1],
#     [lon1, lat1]
# ]]
# get_satellite_image(query_param)