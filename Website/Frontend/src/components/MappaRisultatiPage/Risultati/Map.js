/* eslint-disable no-undef */
import React, {useState, useEffect} from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Geocode from "react-geocode";
import $ from 'jquery';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.setLanguage("it");
Geocode.setRegion("it");
Geocode.setLocationType("ROOFTOP");

function Map({centeredAddress, startDate, endDate, animal, setId}) {
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState();

    const handleMarkerClick = (informations) => {
      setId(informations['id']);
      $("#infoContainer").fadeIn("slow");
      $("#infoNome").text(informations['nome']);
      $("#infoCognome").text(informations['cognome']);
      $("#infoEmail").text(informations['email']);
      $("#infoTelefono").text(informations['telefono']);
      $("#infoIndirizzo").text(informations['indirizzo'] + ", " + informations['citta'] + ", " + informations['cap']);
      $("#infoPrezzo").text(parseFloat(informations['prezzo']).toFixed(2) + "€");
      if (informations['nomeStruttura'] != null) {
        $("#infoTitolo").text("Informazioni sulla struttura")
        $("#infoNomeStruttura").text(informations['nomeStruttura']);
        $("#rowNomeStruttura").css("display", "flex");
        $("#infoCapienza").text(informations['capienza']);
        $("#rowCapienza").css("display", "flex");
        $("#infoAnimali").text("Cani e Gatti");
      } else {
        $("#infoTitolo").text("Informazioni sul PetSitter")
        $("#rowNomeStruttura").css("display", "none");
        $("#rowCapienza").css("display", "none");
        if (informations['animaliDaAccudire'] === 'gatti'){
          $("#infoAnimali").text("Gatti");
        } else if (informations['animaliDaAccudire'] === 'cani') {
          $("#infoAnimali").text("Cani");
        } else {
          $("#infoAnimali").text("Cani e Gatti");
        }
      }
    }

    useEffect(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "startDate": startDate,
          "endDate": endDate,
          "animal": animal
        })
      };

      async function getCenter() {
        let response = await Geocode.fromAddress(centeredAddress);
        const {lat, lng} = response.results[0].geometry.location;
        setCenter({lat: lat, lng: lng});
      }
      
      async function getAddresses() {
        let response = await fetch("http://localhost:30000/api/v1/maps/allResults", requestOptions);
        let addresses = await response.json();
        Object.keys(addresses).forEach(async function (key) {
            let response = await Geocode.fromAddress(addresses[key]['indirizzo'] + ", " + addresses[key]['citta'] + ", " + addresses[key]['cap']);
            const { lat, lng } = response.results[0].geometry.location;
            const marker = (
              <Marker
                key={addresses[key]['id']}
                position={{
                  lat,
                  lng
                }}
                onClick={() => handleMarkerClick(addresses[key])}
              />
            );
            setMarkers(prevMarkers => [...prevMarkers, marker]);
        })
      }
      getCenter();
      getAddresses();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      zoom={12}
      center={center}
      mapContainerStyle={{ height: "60vh", width: "100%"}}
    >
      {markers}
    </GoogleMap>
  );
}

export default Map;
