"use client";
import React, { useState, useEffect } from "react";
import { Typography, Tabs, Card, Row, Col, Spin, Alert, Divider } from "antd";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const mapContainerStyle = {
  width: "100%",
  height: "324px",
  marginTop: "20px",
};

const UserPanel = () => {
  const [activeTabKey, setActiveTabKey] = useState("Profile");
  const [clientData, setClientData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o&callback=initMap&libraries=&v=weekly", // Replace with your API key
  });
  const router = useRouter();
  const { isSignedIn, setIsSignedIn } = useMyContext();
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, []);
  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      setError(null);

      try {
        const clientId = sessionStorage.getItem("userId");
        if (!clientId) {
          throw new Error("Client ID is missing");
        }

        const response = await fetch(`/api/client?clientId=${clientId}`);
        const data = await response.json();

        if (!response.ok) {
          console.log(error);

          throw new Error(data.error || "Failed to fetch client data");
        }

        setClientData(data.client);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const renderProfile = () => {
    if (!clientData) {
      return <Text>No profile data available.</Text>;
    }

    return (
      <Card
        bordered={false}
        className="bookingCard"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <Title level={4} style={{ color: "#a88a7d", marginBottom: "16px" }}>
          Profile Information
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>Name:</Text>
            <Text style={{ marginLeft: "8px" }}>{clientData.name}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Email:</Text>
            <Text style={{ marginLeft: "8px" }}>{clientData.email}</Text>
          </Col>
          <Col span={24}>
            <Text strong>WhatsApp:</Text>
            <Text style={{ marginLeft: "8px" }}>{clientData.whatsapp}</Text>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderBookings = () =>
    bookings.map((booking, index) => (
      <Card
        key={index}
        bordered={false}
        className="bookingCard"
        style={{
          marginBottom: "20px",
          backgroundColor: "#f9f6f4",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        }}
      >
        <Title
          level={5}
          style={{
            color: "#473a3a",
            marginBottom: "16px",
            textAlign: "left",
          }}
        >
          Booking {index + 1}
        </Title>
        <Divider style={{ margin: "12px 0", backgroundColor: " #d9cccc" }} />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>Booking Id:</Text>
            <Text style={{ marginLeft: "8px" }}>{booking._id || "N/A"}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Trainer Name:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {booking.trainerName || "N/A"}
            </Text>
          </Col>
          <Col span={24}>
            <Text strong>Trainer Email:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {booking.trainerEmail || "N/A"}
            </Text>
          </Col>
          <Col span={24}>
            <Text strong>Validity Start:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {new Date(booking.validStartDate).toLocaleDateString()}
            </Text>
          </Col>
          <Col span={24}>
            <Text strong>Validity End:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {new Date(booking.validEndDate).toLocaleDateString()}
            </Text>
          </Col>
          <Col span={24}>
            <Text strong>Booked Slots:</Text>
            <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
              {booking.bookedSlots.map((slot, idx) =>
                Object.entries(slot).map(([day, details]) => (
                  <li key={`${index}-${idx}`}>
                    <Text strong>{day}:</Text>
                    <span style={{ marginLeft: "8px" }}>
                      {details.map((detail, i) => (
                        <span key={i}>{detail.time}</span>
                      ))}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </Col>
          <Col span={24}>
            <Text strong>Booked Location:</Text>
          </Col>
          <Col span={24}>
            {isLoaded && !loadError ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{
                  lat: parseFloat(
                    booking.bookedSlots[0][
                      Object.keys(booking.bookedSlots[0])[0]
                    ][0].location.split(",")[0]
                  ),
                  lng: parseFloat(
                    booking.bookedSlots[0][
                      Object.keys(booking.bookedSlots[0])[0]
                    ][0].location.split(",")[1]
                  ),
                }}
                zoom={12}
              >
                <Marker
                  position={{
                    lat: parseFloat(
                      booking.bookedSlots[0][
                        Object.keys(booking.bookedSlots[0])[0]
                      ][0].location.split(",")[0]
                    ),
                    lng: parseFloat(
                      booking.bookedSlots[0][
                        Object.keys(booking.bookedSlots[0])[0]
                      ][0].location.split(",")[1]
                    ),
                  }}
                />
              </GoogleMap>
            ) : (
              <Text>Map could not be loaded.</Text>
            )}
          </Col>
        </Row>
      </Card>
    ));

  return (
    <div style={{ padding: "17px" }}>
      <section
        className="cardHead"
        style={{
          maxWidth: "790px",
          margin: "50px auto",
          backgroundColor: "#f0eeeb",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Title
            level={5}
            style={{
              color: "white",
              backgroundColor: "#baada6",
              padding: "12px 24px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            Client Panel
          </Title>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="default" />
          </div>
        ) : (
          <Tabs
            activeKey={activeTabKey}
            onChange={(key) => setActiveTabKey(key)}
            centered
            tabBarStyle={{
              border: "none",
              color: "#a88a7d",
              fontWeight: "bold",
            }}
            type="line"
          >
            <TabPane tab="Profile" key="Profile">
              {renderProfile()}
            </TabPane>
            <TabPane tab="Bookings" key="Bookings">
              {bookings.length > 0 ? (
                renderBookings()
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    margin: "auto",
                    margin: "33px auto",
                    fontStyle: "italic",
                  }}
                >
                  No bookings found.
                </div>
              )}
            </TabPane>
          </Tabs>
        )}
      </section>
    </div>
  );
};

export default UserPanel;
