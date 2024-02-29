import mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import './maps.css';
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ longitude, latitude, location }) => {
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiemFjbXV0dXJpNDUiLCJhIjoiY2x0M2Zlc2VmMWswaTJrcGw1aHRwdTA4aiJ9.2_UIX3ZDsWv60F_lQE5_rg'


    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                properties: {
                    title: 'AJALI',
                    description: location
                }
            },
        ]
    };
    
    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
            container: 'mp',
            style: "mapbox://styles/mapbox/streets-v11",
            center: geojson.features[0].geometry.coordinates,
            zoom: 13
        });

        geojson.features.forEach((feature, index) => {
            const el = document.createElement('div');
            el.className = 'mark';
        

            new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`))
            .addTo(map);
        });
        
    }, []);

    return (
        <div id="mp" style={{ width: '100%', height: '100%' }}></div>
    )
}

export default Map;