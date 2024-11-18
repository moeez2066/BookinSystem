import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Spin,
  Select,
  Alert,
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const Rescheduling = () => {
  const [bookingId, setBookingId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (alertInfo.visible) {
      const timer = setTimeout(() => {
        setAlertInfo({ ...alertInfo, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const resetComponent = () => {
    setBookingId("");
    setSelectedDate(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
    setBookingData(null);
    setLoading(false);
    setError(null);
    setLoadingBook(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setBookingData(null);
    setAvailableSlots([]);

    try {
      const formattedDate = selectedDate?.format("YYYY-MM-DD");
      const response = await fetch(
        `/api/bookingDetails?bookingId=${bookingId}&date=${formattedDate}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      setBookingData(data);
      setAvailableSlots(data.availableSlots);
    } catch (err) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const bookedslots = [
      {
        [new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
        })]: [
          {
            time: selectedSlot,
            location: bookingData.placeChords,
          },
        ],
      },
    ];

    const payload = {
      trainer_id: { $oid: bookingData.booking.trainer_id },
      client_id: { $oid: bookingData.booking.client_id },
      bookedslots,
      valid_start_date: { $date: bookingData.valid_start_date },
      valid_end_date: { $date: bookingData.valid_end_date },
      date_of_creation: { $date: new Date().toISOString() },
    };

    try {
      setLoadingBook(true);
      const response = await fetch("/api/save-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlertInfo({
          visible: true,
          type: "success",
          message: "Booking rescheduled successfully!",
        });
        resetComponent();
      } else {
        throw new Error("Failed to reschedule booking.");
      }
    } catch (error) {
      setAlertInfo({
        visible: true,
        type: "error",
        message:
          "An error occurred while saving your booking. Please try again.",
      });
    } finally {
      setLoadingBook(false);
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <Title level={4} style={{ color: "#a88a7d", marginBottom: "16px" }}>
        Rescheduling
      </Title>
      {alertInfo.visible && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          closable
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "black",
          }}
        />
      )}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text strong>Enter Booking ID</Text>
          <br />
          <Input
            className="modal-inn"
            placeholder="Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            style={{ marginTop: "8px", marginBottom: "3px", height: "155px" }}
          />
        </Col>

        <Col span={24}>
          <Text strong>Select Rescheduling Date</Text>
          <DatePicker
            placeholder="Select a date"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            style={{
              width: "100%",
              marginTop: "8px",
              marginBottom: "3px",
              borderColor: "#473a3a",
              boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
            }}
          />
        </Col>

        <Col span={24}>
          <Button
            type="primary"
            onClick={handleSearch}
            disabled={!bookingId || !selectedDate}
            loading={loading}
            style={{
              backgroundColor: "#a88a7d",
              borderColor: "#a88a7d",
              color: "#ffffff",
            }}
          >
            Check Free Slots
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="default" />
        </div>
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : bookingData ? (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Text strong>Trainer Available Slots</Text>
              {availableSlots.length > 0 ? (
                <Select
                  placeholder="Select a time slot"
                  style={{ width: "100%", marginTop: "8px" }}
                  onChange={(value) => setSelectedSlot(value)}
                >
                  {availableSlots.map((slot, index) => (
                    <Option key={index} value={slot}>
                      {slot}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Text>No available slots found.</Text>
              )}
            </Col>
          </Row>

          {selectedSlot && (
            <Row
              gutter={[16, 16]}
              style={{ marginTop: "20px", justifyContent: "center" }}
            >
              <Col xs={24} sm={12} md={8} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={handleRegister}
                  loading={loadingBook}
                  block
                  style={{
                    backgroundColor: "#473a3a",
                    borderColor: "#473a3a",
                    color: "#ffffff",
                  }}
                >
                  Reschedule Booking
                </Button>
              </Col>
            </Row>
          )}
        </>
      ) : null}
    </Card>
  );
};

export default Rescheduling;
