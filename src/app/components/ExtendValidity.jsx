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
  Alert,
} from "antd";
import { Calendar, CalendarPlus, CheckCircle, Search } from "lucide-react";

const { Text } = Typography;

const ExtendBookingValidity = ({ setRefetch }) => {
  // State management
  const [bookingId, setBookingId] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [selectedNewDate, setSelectedNewDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });

  // Auto-hide alert after a few seconds
  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(
        () => setAlert({ ...alert, visible: false }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch booking details
  const fetchBookingDetails = async () => {
    setIsLoading(true);
    setBookingDetails(null);

    try {
      const response = await fetch(
        `/api/validityRanges?bookingId=${bookingId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch booking details");
      }

      setBookingDetails(data);
    } catch (error) {
      setAlert({
        visible: true,
        type: "error",
        message: "Incorrect Booking Id",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle validity extension
  const extendBookingValidity = async () => {
    if (!selectedNewDate) {
      setAlert({
        visible: true,
        type: "error",
        message: "Please select a new validity date.",
      });
      return;
    }

    const payload = JSON.stringify({
      bookingId: bookingDetails._id,
      newEndDate: selectedNewDate.toISOString(),
    });

    setIsSaving(true);

    try {
      const response = await fetch("/api/extend-validity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extend booking validity.");
      }

      setAlert({
        visible: true,
        type: "success",
        message: "Booking validity extended successfully!",
      });
      setRefetch(true);
      setBookingId("");
      setBookingDetails(null);
      setSelectedNewDate(null);
    } catch (error) {
      setAlert({ visible: true, type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      bordered={false}
      className="sm:p-[20px] bg-[#f9f6f4] border-[#baada6]/20 border"
      style={{ borderRadius: "12px" }}
    >
      {/* Header */}
      <div className="py-4 pt-0">
        <div className="flex gap-2 items-center justify-center">
          <CalendarPlus className="w-6 h-6 text-[#a88a7d]" />
          <h1 className="text-lg sm:text-xl font-semibold text-[#a88a7d]">
            Extend Booking Validity
          </h1>
        </div>
      </div>

      {/* Booking ID Input */}
      <div className="space-y-2">
        <br />
        <label className="flex items-center gap-2 text-sm font-medium text-[#a88a7d]">
          <Search className="w-4 h-4" />
          Booking ID
        </label>
        <div className="relative flex flex-col items-center">
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="block w-full px-4 py-2.5 text-gray-900 border outline-none border-[#473a3a]/20 rounded-lg transition-colors"
            placeholder="Enter your booking ID"
          />
          <button
            onClick={fetchBookingDetails}
            disabled={!bookingId}
            className="absolute hidden md:block right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#baada6] text-white rounded-md hover:bg-[#a88a7d] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
          <button
            onClick={fetchBookingDetails}
            disabled={!bookingId}
            className="sm:hidden mt-3 px-4 py-1.5 bg-[#baada6] text-white rounded-md hover:bg-[#a88a7d] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>
      </div>
      {/* Alert Messages */}
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          closable
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}

      {/* Booking Details */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="default" />
        </div>
      ) : bookingDetails ? (
        <>
          <div className="mt-6 sm:ml-1 flex items-center justify-between">
            <div className="flex items-center justify-center flex-col sm:flex-row">
              <p className="text-xs flex flex-col sm:flex-row sm:mr-4 items-center sm:text-sm font-medium text-[#8b7355]">
                <Calendar className="mr-1" size={20} /> Booking Start Date
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {new Date(bookingDetails.valid_start_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <p className="text-xs flex flex-col items-center sm:flex-row sm:mr-4 sm:text-sm font-medium text-[#8b7355]">
                <CheckCircle className="mr-1" size={20} /> Booking End Date
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {new Date(bookingDetails.valid_end_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Row
            gutter={[16, 16]}
            style={{ marginTop: "36px" }}
            className="flex items-center justify-center"
          >
            <Col
              xs={24}
              sm={12}
              md={10}
              className="flex flex-col sm:flex-row items-center justify-center"
            >
              <Text strong className="text-[#8b7355] text-nowrap mb-2 sm:mb-0">
                Extend Validity To &nbsp;
              </Text>
              <DatePicker
                placeholder="Select validity date"
                value={selectedNewDate}
                onChange={(date) => setSelectedNewDate(date)}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "27px" }}>
            <Col xs={24}>
              <Button
                type="primary"
                onClick={extendBookingValidity}
                loading={isSaving}
                block
                style={{ backgroundColor: "#473a3a", borderColor: "#473a3a" }}
              >
                Extend Validity
              </Button>
            </Col>
          </Row>
        </>
      ) : null}
    </Card>
  );
};

export default ExtendBookingValidity;
