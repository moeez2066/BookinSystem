import React, { useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./CalendarComponent.css";
import { Select, Input, Button, Typography, Row, Col, Space } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const mapContainerStyle = {
  width: "100%",
  height: "216px",
  marginTop: "-24px",
};

const defaultCenter = {
  lat: 24.7136,
  lng: 46.6753,
};

const MapComponent = ({ showCalendar, toggleCalendar }) => {
  const [originCity, setOriginCity] = useState("Riyadh");
  const [place, setPlace] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o&callback=initMap&libraries=&v=weekly", // Replace with your actual API key
  });

  const updateMapLocation = useCallback(() => {
    if (!place) {
      alert("Please enter a specific place in Riyadh.");
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: `${place}, ${originCity}` },
      (results, status) => {
        if (status === "OK" && results[0]) {
          setMapCenter(results[0].geometry.location);
        } else {
          alert(
            "Could not find the location. Please try a different place name."
          );
        }
      }
    );
  }, [originCity, place]);

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
              style={{ color: "#473a3a", fontSize: "clamp(8px, 1.5vw, 14px)" }}
            >
              Enter Place
            </Text>
            <Input
              placeholder="e.g., King Fahd Road"
              onChange={(e) => setPlace(e.target.value)}
              style={{
                color: "#473a3a",
                borderColor: "#b2d8b2",
                fontSize: "clamp(8px, 1.5vw, 14px)",
              }}
            />
          </Col>
        </Row>

        <div
          style={{ textAlign: "center", marginTop: "-4px", padding: "-4px" }}
        >
          <Button
          className="ant-loc-button"
            type="primary"
            onClick={updateMapLocation}
            style={{
              width: "142px",
              backgroundColor: "#a88a7d",
              color: "white",
              borderColor: "#a88a7d",
              fontSize: "clamp(10px, 1.5vw, 12px)",
              boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
            }}
          >
            Show Location on Map
          </Button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </div>
      </Space>

      {place && (
        <div
          className="arrow-top"
          onClick={toggleCalendar}
          style={{ cursor: "pointer" }}
        >
          ➔
        </div>
      )}
    </div>
  );
};

export default MapComponent;
