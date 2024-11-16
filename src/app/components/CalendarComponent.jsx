import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Typography,
  Space,
  Spin,
  DatePicker,
  Alert,
} from "antd";
import "./CalendarComponent.css";
import { days } from "../days/dat";
import moment from "moment";
import { parseValidity } from "../trainers/dat";
import CheckSignInModal from "./AuthenticationModal";

const { Title, Text } = Typography;
const { Option } = Select;

const CalendarComponent = ({ data, sessionPackage, placeChords }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSlotsBookedMessage, setAllSlotsBookedMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [numberOfSessions, setNumberOfSessions] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDay(null);
    setAllSlotsBookedMessage("");
    setSelectedSlots({});
  };
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const handleNumberOfSessionsChange = (value) => {
    setNumberOfSessions(value);
    setSelectedDay(null);
    setSelectedSlots({});
    setAlertInfo({
      visible: false,
      type: "",
      message: "",
    });
  };
  useEffect(() => {
    let timer;
    if (alertInfo.visible) {
      timer = setTimeout(() => {
        setAlertInfo({ ...alertInfo, visible: false });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alertInfo.visible]);
  const handleDayClick = async (day) => {
    if (!selectedDate) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: "Select Starting Date",
      });
      return;
    }

    if (!numberOfSessions) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: "Select the number of sessions",
      });
      return;
    }

    // Allow navigating to days with already selected slots
    if (
      Object.keys(selectedSlots).length >= numberOfSessions &&
      !selectedSlots[day]
    ) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: `You can only select slots for ${numberOfSessions} days`,
      });
      return;
    }

    setSelectedDay(day);
    setLoading(true);
    setAllSlotsBookedMessage("");

    try {
      const response = await fetch(
        `/api/get-data?trainerId=${data._id}&day=${day}&validity=${
          sessionPackage.validity
        }&date=${selectedDate.format("YYYY-MM-DD")}&placeChords=${placeChords}`
      );

      const result = await response.json();

      if (result.message === "All slots booked") {
        setAllSlotsBookedMessage("All slots booked for this day.");
        setAvailableSlots([]);
      } else {
        setAvailableSlots(result.availableSlots || []);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (value) => {
    setSelectedSlots((prevSlots) => ({
      ...prevSlots,
      [selectedDay]: value,
    }));
  };

  const handleRegister = async () => {
    const isSignedIn = sessionStorage.getItem("isSignedIn");

    if (!isSignedIn) {
      setIsModalVisible(true);
      return;
    }
    const { valid_start_date, valid_end_date } = parseValidity(
      sessionPackage.validity,
      selectedDate.toISOString()
    );

    // Construct the `bookedslots` array from all selected slots
    const bookedslots = Object.entries(selectedSlots).map(([day, time]) => ({
      [day]: [
        {
          time,
          location: placeChords,
        },
      ],
    }));

    const payload = {
      trainer_id: { $oid: data._id },
      bookedslots,
      valid_start_date: { $date: valid_start_date },
      valid_end_date: { $date: valid_end_date },
      date_of_creation: { $date: new Date().toISOString() },
      client_id: { $oid: sessionStorage.getItem("userId") },
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
          message: "Booking saved successfully!",
        });
      } else {
        throw new Error("Failed to save booking.");
      }
      setLoadingBook(false);
    } catch (error) {
      console.error("Error saving booking:", error);
      setAlertInfo({
        visible: true,
        type: "error",
        message:
          "An error occurred while saving your booking. Please try again.",
      });
      setLoadingBook(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f0eeeb",
        borderRadius: "10px",
        maxWidth: "100%",
      }}
    >
      <Title
        level={4}
        style={{ color: "#473a3a", fontSize: "clamp(10px, 2vw, 16px)" }}
      >
        Select Your Starting Date
      </Title>
      <DatePicker
        onChange={handleDateChange}
        style={{
          marginBottom: "20px",
          borderColor: "#473a3a",
          boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
        }}
        disabledDate={(current) => current && current < moment().startOf("day")}
        placeholder="Select date"
      />
      <Title
        level={4}
        style={{ color: "#473a3a", fontSize: "clamp(10px, 2vw, 16px)" }}
      >
        Select No Of Sessions
      </Title>
      <Select
        placeholder="Select no of sessions"
        style={{
          width: "172px",
          maxWidth: 200,
          marginLeft: "10px",
          color: "#473a3a",
          borderColor: "#b2d8b2",
          fontSize: "clamp(8px, 1.5vw, 12px)",
        }}
        dropdownClassName="custom-dropdown"
        optionLabelProp="label"
        onChange={handleNumberOfSessionsChange}
      >
        {[1, 2, 3, 4, 5, 6].map((sessions) => (
          <Option
            key={sessions}
            value={sessions}
            label={`${sessions} sessions / week`}
          >
            {`${sessions} sessions / week`}
          </Option>
        ))}
      </Select>
      <span >
        <br />
      </span>
      <span className="desktop-only-br">
        <br />
      </span>
      <Title
        level={4}
        style={{ color: "#473a3a", fontSize: "clamp(10px, 2vw, 16px)" }}
      >
        Select Your Days
      </Title>
      <span className="desktop-only-br">
        <br />
      </span>
      <Space wrap style={{ marginBottom: "20px", justifyContent: "center" }}>
        {days.map((day) => (
          <Button
            key={day}
            type="default"
            style={{
              backgroundColor:
                selectedDay === day
                  ? "#a88a7d"
                  : selectedSlots[day]
                  ? "#b2d8b2"
                  : "#f0eeeb",
              color: selectedDay === day ? "white" : "#473a3a",
              borderColor:
                selectedDay === day
                  ? "#a88a7d"
                  : selectedSlots[day]
                  ? "#b2d8b2"
                  : "#473a3a",
              fontSize: "clamp(8px, 1.5vw, 14px)",
              padding: "5px 10px",
            }}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </Button>
        ))}
      </Space>

      <Title
        level={4}
        style={{
          marginTop: "20px",
          color: "#473a3a",
          fontSize: "clamp(10px, 2vw, 16px)",
        }}
      >
        Available Time Slots
      </Title>

      {loading ? (
        <>
          <br />
          <Spin />
        </>
      ) : selectedDay ? (
        allSlotsBookedMessage ? (
          <Text
            italic
            style={{
              display: "block",
              marginTop: "10px",
              color: "#473a3a",
              fontSize: "clamp(10px, 1.5vw, 14px)",
            }}
          >
            <br />
            {allSlotsBookedMessage}
          </Text>
        ) : (
          <div style={{ marginTop: "10px" }}>
            <span className="desktop-only-br">
              <br />
            </span>

            <Text
              strong
              style={{ color: "#473a3a", fontSize: "clamp(9px, 1.5vw, 14px)" }}
            >
              Available Time Slots for {selectedDay}
            </Text>
            <Select
              placeholder="Select a time slot"
              style={{
                width: "100%",
                maxWidth: 200,
                marginLeft: "10px",
                color: "#473a3a",
                borderColor: "#b2d8b2",
                fontSize: "clamp(8px, 1.5vw, 12px)",
              }}
              dropdownClassName="custom-dropdown"
              value={selectedSlots[selectedDay] || null}
              onChange={handleSlotChange}
              optionLabelProp="label"
            >
              {availableSlots.map((slot) => (
                <Option key={slot} value={slot} label={slot}>
                  {slot}
                </Option>
              ))}
            </Select>
          </div>
        )
      ) : (
        <Text
          italic
          style={{
            display: "block",
            marginTop: "10px",
            color: "#473a3a",
            fontSize: "clamp(10px, 1.5vw, 14px)",
          }}
        >
          Select a day to view time slots.
        </Text>
      )}

      {selectedDay && selectedSlots[selectedDay] && (
        <div style={{ marginTop: "20px" }}>
          <Text
            style={{ color: "#473a3a", fontSize: "clamp(9px, 1.5vw, 14px)" }}
          >
            You selected <strong>{selectedSlots[selectedDay]}</strong> on{" "}
            <strong>{selectedDay}</strong>
          </Text>
        </div>
      )}
      {Object.keys(selectedSlots).length === numberOfSessions && (
        <>
          <Button
            className="arrow-top "
            style={{
              backgroundColor: "#a88a7d",
              borderColor: "#a88a7d",
              color: "#ffffff",
              marginRight: "25px",
              marginTop: "12px",
            }}
            loading={loadingBook}
            onClick={handleRegister}
          >
            Register
          </Button>
        </>
      )}
      <CheckSignInModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
      {alertInfo.visible && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          closable
          onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "black",
          }}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
