import React, { Fragment, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Establishment from './components/Establishment';
import NearstCoffees from './components/NearstCoffees';

import EstablishmentsService from './services/establishment_service';

function App() {  
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState({});
  
  const { REACT_APP_GOOGLE_API_KEY } = process.env;

  useEffect(() => {
    async function setCurrentLocation() {
      await navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        loadCoffeeShops(position.coords.latitude, position.coords.longitude);
      }, function(error) {
        alert("Habilite a localização para usar esse APP")
      })
    }

    async function loadCoffeeShops(lat, long) {
      const response = await EstablishmentsService.index(lat, long);
      setLocations(response.data.results);
    }

    setCurrentLocation();
  }, []);

  return (
    <Fragment>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap mapContainerStyle={{height: "100vh", width: "100%"}}
          zoom={15}
          center={{lat: latitude, lng: longitude}}
        >
          {
            locations.map((item, index) => {
              return (
                <Marker key={index} icon="/images/cerveja.png" title={item.name} animation="4" 
                  position={{lat: item.geometry.location.lat, lng: item.geometry.location.lng}}
                  onClick={() => setSelected(item)}
                />
              )
            })
          }
          {
            selected.place_id && (
              <Establishment place={selected}/>
            )
          }
          <Marker key="my location" icon="/images/homer-simpson.png" title="Seu local" animation="2"
            position={{lat: latitude, lng: longitude}}
          />

        {(latitude != 0 && longitude != 0) && 
          <NearstCoffees latitude={latitude} longitude={longitude} /> 
        }

        </GoogleMap>
      </LoadScript>
    </Fragment>
  );
}

export default App;
