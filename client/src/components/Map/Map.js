import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import EntryForm from "./EntryForm";
import { listEvents, listLocation } from "../../utils/API";
import ControlPanel from "./Control-Panel";
import Pin from "./pin";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./Map.css";
require("dotenv").config();

const Map = () => {
  // map setup
  const api = `pk.eyJ1IjoiZnJhbmNpc24yMSIsImEiOiJja2x1amVuNGQwYmVkMm9vZW9xc3VwOW9jIn0.eh8hBFzSr0tJUxungpfu3A`;
  const mapstyle = "mapbox://styles/francisn21/cklv81byf44mx17ql4bv4chxl";
  const [showevents, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEventLocation, setEventLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.0902,
    longitude: -95.7129,
    zoom: 10,
  });

  // useeffect for calling API to load saved events to markers on the map
  // reusable backend call to fetch event database
  const getEvents = async () => {
    const showMarkers = await listLocation();
    const test = await listEvents();
    console.log(test);

    setEvents(showMarkers);
  };

  useEffect(() => {
    getEvents();
  }, []);

  //
  const geolocateStyle = {
    top: 0,
    right: 0,
    margin: 10,
  };
  const positionOptions = { enableHighAccuracy: true };

  //===========TEST CONTAINER============//
  const navStyle = {
    position: "absolute",
    top: 40,
    right: 30,
    padding: "10px",
  };
  const controlStyle = {
    position: "auto",
    top: 150,
    left: 0,
    padding: "10px",
  };
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });
  const [events, logEvents] = useState({});

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);
  // ===========ENDS HERE============ //
  //  GeoCoder Location //
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );
  // navyblue color for the events
  const navyblue = {
    fill: "#1f4980",
    stroke: "none",
  };
  const red = {
    fill: "red",
    stroke: "none",
  };
  // new Event section //

  const addEventPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setEventLocation({
      latitude,
      longitude,
    });
  };
  return (
    <div id="map">
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        mapboxApiAccessToken={api}
        mapStyle={mapstyle}
        onClick={() => setShowPopup({})}
        onDblClick={addEventPopup}
        onViewportChange={handleViewportChange}
      >
        {/* display marker section */}
        {showevents.map((event) => (
          <React.Fragment key={event._id}>
            <Marker
              // className="event-pin"
              latitude={event.location[0].latitude}
              longitude={event.location[0].longitude}
              offsetTop={-20}
              offsetLeft={-10}
            >
              {/* div wrapper to add onclick to the markers on the map to show the event info */}
              <div
                onClick={() =>
                  setShowPopup({
                    // ...showPopup,
                    [event._id]: true,
                  })
                }
              >
                <svg
                  style={navyblue}
                  height="20"
                  viewBox="0 0 24 24"
                  x="0px"
                  y="0px"
                >
                  <path
                    d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
            c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
            C20.1,15.8,20.2,15.8,20.2,15.7z"
                  />
                </svg>
              </div>
            </Marker>
            {showPopup[event._id] ? (
              <Popup
                latitude={event.location[0].latitude}
                longitude={event.location[0].longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top"
              >
                <div className="popup">
                  <h3>{event.name}</h3>
                  <p>{event.description}</p>
                  <p>{event.date}</p>
                </div>
              </Popup>
            ) : null}
          </React.Fragment>
        ))}
        {/* display marker section END*/}
        {/* New Location section */}
        {addEventLocation ? (
          <>
            <Marker
              latitude={addEventLocation.latitude}
              longitude={addEventLocation.longitude}
              offsetTop={-30}
              offsetLeft={-10}
            >
              <div>
                <svg
                  style={red}
                  height="20"
                  viewBox="0 0 24 24"
                  x="0px"
                  y="0px"
                >
                  <path
                    d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
            c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
            C20.1,15.8,20.2,15.8,20.2,15.7z"
                  />
                </svg>
              </div>
            </Marker>
            <Popup
              latitude={addEventLocation.latitude}
              longitude={addEventLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setEventLocation(null)}
              anchor="top"
            >
              <div className="popup">
                <EntryForm
                  onClose={() => {
                    setEventLocation(null);
                    getEvents();
                  }}
                  location={addEventLocation}
                />
              </div>
            </Popup>
          </>
        ) : null}
        {/* New Location section end*/}
        {/* location search */}
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={api}
          position="top-left"
        />

        {/* Components for testing lat and long */}
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        >
          <Pin size={20} />
        </Marker>
        {/* Utilities Section */}

        {/* looks for user location */}
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={positionOptions}
          trackUserLocation
          auto
        />
        {/*  */}
        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
        <ControlPanel events={events} style={controlStyle} />
      </ReactMapGL>
    </div>
  );
};

export default Map;
