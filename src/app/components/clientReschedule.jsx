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
  Select,
} from "antd";
import { CalendarClock, Search } from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

const Rescheduling = ({ setRefetch }) => {
  // State management
  const [bookingId, setBookingId] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [selectedSlotDate, setSelectedSlotDate] = useState(null);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkSlotsLoading, setCheckSlotsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    type: "",
    message: "",
  });

  // Auto-hide alert after a few seconds
  useEffect(() => {
    if (alertInfo.visible) {
      const timer = setTimeout(() => {
        setAlertInfo({ ...alertInfo, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // Fetch booking details
  const handleSearch = async () => {
    setLoading(true);
    setBookingData(null);
    setAvailableSlots([]);

    try {
      const response = await fetch(
        `/api/validityRanges?bookingId=${bookingId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      setBookingData(data);
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

  // Fetch available slots for the selected date
  const handleCheckSlots = async () => {
    if (!bookingId || !selectedScheduleDate) {
      setAlertInfo({
        visible: true,
        type: "warning",
        message: "Please provide a booking ID and select a schedule date.",
      });
      return;
    }

    setCheckSlotsLoading(true);

    try {
      const response = await fetch(
        `/api/clientBooking?bookingId=${bookingId}&bookedDate=${selectedSlotDate.format(
          "YYYY-MM-DD"
        )}&date=${selectedScheduleDate.format("YYYY-MM-DD")}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch available slots.");
      }
      setAvailableSlots(data.availableSlots || []);
    } catch (err) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: err.message,
      });
    } finally {
      setCheckSlotsLoading(false);
    }
  };

  const handleSaveBooking = async () => {
    if (!selectedSlot) {
      setAlertInfo({
        visible: true,
        type: "warning",
        message: "Please select a slot to save.",
      });
      return;
    }

    setSaving(true);

    // Create a new Date object for the selected date and set time to midday
    const formatDateAsMidday = (date) => {
      const newDate = new Date(date);
      newDate.setHours(12, 0, 0, 0); // Set time to 12:00 noon
      return newDate.toISOString();
    };

    const payload = JSON.stringify({
      parentBooking: bookingData._id,
      trainer_id: bookingData.trainer_id,
      client_id: bookingData.client_id,
      bookedslots: [
        {
          [new Date(selectedScheduleDate).toLocaleString("en-US", {
            weekday: "long",
          })]: [
            {
              time: selectedSlot,
              location: bookingData.location,
            },
          ],
        },
      ],
      valid_start_date: { $date: formatDateAsMidday(selectedScheduleDate) },
      valid_end_date: { $date: formatDateAsMidday(selectedScheduleDate) },
      date_of_creation: { $date: new Date().toISOString() },
      freeSlot: { $date: formatDateAsMidday(selectedSlotDate) },
    });
    try {
      const response = await fetch("/api/save-rescheduling-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save booking.");
      }

      setAlertInfo({
        visible: true,
        type: "success",
        message: "Booking rescheduled successfully!",
      });
      setRefetch(true);
      // Reset state
      setBookingId("");
      setBookingData(null);
      setSelectedSlotDate(null);
      setSelectedScheduleDate(null);
      setAvailableSlots([]);
      setSelectedSlot(null);
    } catch (err) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      bordered={false}
      className="sm:p-[20px] bg-[#f9f6f4] border-[#baada6]/20 border"
      style={{
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <div className=" py-4 pt-0">
        <div className="flex gap-2 items-center  justify-center">
          <CalendarClock className="w-6 h-6 text-[#a88a7d]" />
          <h1 className="text-lg sm:text-xl font-semibold text-[#a88a7d]">
            Appointment Rescheduling
          </h1>
        </div>
      </div>
      {/* Booking ID Section */}
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
            onClick={handleSearch}
            disabled={!bookingId || loading}
            className="absolute hidden md:block right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#baada6] text-white rounded-md hover:bg-[#a88a7d] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
          <button
            onClick={handleSearch}
            disabled={!bookingId || loading}
            className="sm:hidden mt-3 px-4 py-1.5 bg-[#baada6] text-white rounded-md hover:bg-[#a88a7d] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
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
          }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="default" />
        </div>
      ) : bookingData ? (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={10}>
              <Text strong>Select Booked Slot Date</Text>
              <DatePicker
                placeholder="Select Booked Slot Date"
                value={selectedSlotDate}
                onChange={(date) => {
                  setAvailableSlots([]);
                  setSelectedSlotDate(date);
                }}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  marginBottom: "3px",
                }}
                disabledDate={(current) =>
                  current &&
                  (current.isBefore(bookingData.valid_start_date) ||
                    current.isAfter(bookingData.valid_end_date))
                }
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={10}>
              <Text strong>Select Schedule Date</Text>
              <DatePicker
                placeholder="Select schedule date"
                value={selectedScheduleDate}
                onChange={(date) => {
                  setAvailableSlots([]);
                  setSelectedScheduleDate(date);
                }}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  marginBottom: "3px",
                }}
                disabledDate={(current) =>
                  current &&
                  (current.isBefore(bookingData.valid_start_date) ||
                    current.isAfter(bookingData.valid_end_date))
                }
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24}>
              <Button
                type="primary"
                onClick={handleCheckSlots}
                loading={checkSlotsLoading}
                block
                style={{ backgroundColor: "#473a3a", borderColor: "#473a3a" }}
              >
                Check Available Slots
              </Button>
            </Col>
          </Row>

          {availableSlots.length > 0 && (
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} sm={12} md={10}>
                <Text strong>Select an Available Slot</Text>
                <Select
                  placeholder="Select a slot"
                  value={selectedSlot}
                  onChange={(value) => setSelectedSlot(value)}
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  {availableSlots.map((slot, index) => (
                    <Option key={index} value={slot}>
                      {slot}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          )}

          {selectedSlot && (
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24}>
                <Button
                  type="primary"
                  onClick={handleSaveBooking}
                  loading={saving}
                  block
                  style={{ backgroundColor: "#473a3a", borderColor: "#473a3a" }}
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
