import React, { useState, useRef, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import "./Map.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Navbar2 from '../navbar/Navbar2';
import L from "leaflet";
import useGeoLocation from '../hook/useGeolocation';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import eventBus from '../eventBus/EventBus';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';

const mapStyles = { width: '100%', height: '100%' };

function MapFlyTo({ coords, isButtonClicked }) {
    const map = useMap();
    if (isButtonClicked) { map.flyTo(coords, 14); }
    // else {map.flyTo(coords, 4);}
    return null;
}
const Map = (props) => {
    const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 });
    const [mapLayers, setMapLayers] = useState([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const ZOOM_LEVEL = 4;
    const mapRef = useRef();
    const location = useGeoLocation();

    const handleButtonClick = () => { setIsButtonClicked(!isButtonClicked); };
    const set_coordinates = (coords) => { 
        const latlongs = {
            'lat1': coords[0]['lat'],
            'lon1': coords[0]['lng'],
            'lat2': coords[2]['lat'],
            'lon2': coords[2]['lng']
        }

        props.set_coords(latlongs)
     }

    const _onCreate = (e) => {
        console.log('onCreate');

        const { layerType, layer } = e;
        if (layerType === "rectangle") {
            const { _leaflet_id } = layer;

            setMapLayers((layers) => [
                ...layers,
                { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
            ]);
        }
        set_coordinates(layer.getLatLngs()[0])
    };

    const _onEdited = (e) => {
        console.log('onEdit');
        const {
            layers: { _layers },
        } = e;

        Object.values(_layers).map(({ _leaflet_id, editing }) => {
            setMapLayers((layers) =>
                layers.map((l) =>
                    l.id === _leaflet_id
                        ? { ...l, latlngs: { ...editing.latlngs[0] } }
                        : l
                )
            );
        });
    };

    const _onDeleted = (e) => {
        console.log(e);
        const {
            layers: { _layers },
        } = e;

        Object.values(_layers).map(({ _leaflet_id }) => {
            setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
        });
    };

    useEffect(() => {
        const handleButtonClick = (msg) => {
            console.log(msg);
            setIsButtonClicked(!isButtonClicked);
        };
        eventBus.on('goToCurLoc', handleButtonClick);

        return () => {
            eventBus.off('goToCurLoc', handleButtonClick);
        };
    }, [isButtonClicked]);

    const Search = () => {
        const map = useMap()

        useEffect(() => {
            const search = new GeoSearchControl({
                provider: new OpenStreetMapProvider(),
                // style: 'button',
                showMarker: true,
                showPopup: true,
                autoClose: true,
                retainZoomLevel: false,
                animateZoom: true,
                keepResult: false,
                searchLabel: 'search'
            });

            map.addControl(search)
            return () => map.removeControl(search)
        }, [])

        return null // don't want anything to show up from this comp
    }

    return (
            <div className='map'>
                <MapContainer center={[13.084622, 80.248357]} zoom={4} scrollWheelZoom={true} style={mapStyles} mapType='hybrid'>
                    <FeatureGroup>
                        <EditControl
                            position="topright" onCreated={_onCreate} onEdited={_onEdited} onDeleted={_onDeleted}
                            draw={{ polygon: false, polyline: false, circle: false, circlemarker: false, marker: false, }}
                        />
                    </FeatureGroup>
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                    {location.loaded && !location.error && (
                        <Marker
                            position={[location.coordinates.lat, location.coordinates.lng,]}
                        ></Marker>
                    )}
                    <MapFlyTo coords={[location.coordinates.lat, location.coordinates.lng,]} isButtonClicked={isButtonClicked} />
                    <button onClick={handleButtonClick}>
                        {isButtonClicked ? 'Reset' : 'Current Location'}
                    </button>
                    <Search />
                </MapContainer>
                {/* <div className='child'>
                <pre className="text-left">{JSON.stringify(mapLayers, 0, 2)}</pre>
            </div> */}
            </div>
    );
}

const mapStateToProps = (state) => ({ selected_coordinates: state.selected_coordinates });

const mapDispatchToProps = (dispatch) => {
    return  {
        set_coords: (coords) => dispatch({ type: "set_coordinates", payload: coords})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);