import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import "./CalendarComponent.css";
import { Select, Button, Typography, Row, Col, Space, Input } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const mapContainerStyle = {
  width: "100%",
  height: "254px",
  marginTop: "-40px",
};

const defaultCenter = {
  lat: 24.7136,
  lng: 46.6753,
};
const defaultDestination = "Chaklala Scheme 3, Rawalpindi";

const MapComponent = ({ showCalendar, toggleCalendar, setPlaceChords }) => {
  const [originCity, setOriginCity] = useState("Riyadh");
  const [place, setPlace] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapPlace, setMapPlace] = useState(null);
  const destinationRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o&callback=initMap&libraries=&v=weekly",
    libraries: ["places"],
  });

  const handleSelectDestination = () => {
    const selectedPlace = destinationRef.current.getPlace();
    if (selectedPlace && selectedPlace.geometry) {
      const newCenter = {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      };
      setMapCenter(newCenter);
      setPlace(selectedPlace.name);
      setMapPlace(selectedPlace.name);
      setPlaceChords(`${newCenter.lat},${newCenter.lng}`);
    }
  };

  const handleInputChange = (e) => {
    setPlace(e.target.value);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", position: "relative" }}>
      <Title
        level={4}
        style={{
          textAlign: "center",
          color: "#473a3a",
          fontSize: "clamp(10px, 2vw, 16px)",
        }}
      >
        Confirm Your Location
      </Title>

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Row gutter={16} className="city">
          <Col span={12}>
            <Text
              style={{ color: "#473a3a", fontSize: "clamp(8px, 1.5vw, 14px)" }}
              className="dd"
            >
              Select Origin City
            </Text>
            <Select
              defaultValue="Riyadh"
              style={{
                width: "100%",
                maxWidth: 200,
                color: "#473a3a",
                borderColor: "#b2d8b2",
                fontSize: "clamp(8px, 1.5vw, 12px)",
              }}
              className="mapstep"
              dropdownClassName="custom-drop"
              onChange={(value) => setOriginCity(value)}
            >
              <Option value="Riyadh">Riyadh</Option>
            </Select>
          </Col>

          <Col span={12}>
            <Text
              className="dd"
              style={{ color: "#473a3a", fontSize: "clamp(8px, 1.5vw, 14px)" }}
            >
              Enter Place
            </Text>
            <Autocomplete
              onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
              onPlaceChanged={handleSelectDestination}
            >
              <Input
                type="text"
                placeholder="e.g., fahd road"
                value={place}
                onChange={handleInputChange}
              />
            </Autocomplete>
            <br />
          </Col>
        </Row>

        <div style={{ marginTop: "20px" }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-13px",
          }}
        >
          {place && mapPlace && (
            <button
              style={{ cursor: "pointer", marginTop: "12px" }}
              className="arrow-top"
              onClick={toggleCalendar}
            >
              next
            </button>
          )}
        </div>
      </Space>
    </div>
  );
};

export default MapComponent;
