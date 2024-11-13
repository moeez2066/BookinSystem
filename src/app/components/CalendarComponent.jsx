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

const { Title, Text } = Typography;
const { Option } = Select;

const CalendarComponent = ({ data, sessionPackage,placeChords }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSlotsBookedMessage, setAllSlotsBookedMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
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
  useEffect(() => {
    let timer;
    if (alertInfo.visible) {
      // Set the alert to auto-close after 3000 milliseconds (3 seconds)
      timer = setTimeout(() => {
        setAlertInfo({ ...alertInfo, visible: false });
      }, 3000);
    }

    // Clean up the timer when alert is closed manually or if component unmounts
    return () => clearTimeout(timer);
  }, [alertInfo.visible]);
  const handleDayClick = async (day) => {
    if (selectedDate) {
      setSelectedDay(day);
      setLoading(true);
      setAllSlotsBookedMessage("");

      try {
        const response = await fetch(`/api/get-data?trainerId=${data._id}&day=${day}&validity=${
            sessionPackage.validity
          }&date=${selectedDate.format("YYYY-MM-DD")}&placeChords=${placeChords}`)

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
    } else {
      setAlertInfo({
        visible: true,
        type: "info",
        message: "Select Starting Date",
      });
    }
  };

  const handleSlotChange = (value) => {
    setSelectedSlots((prevSlots) => ({
      ...prevSlots,
      [selectedDay]: value,
    }));
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
        disabledDate={current => current && current < moment().startOf('day')}
        placeholder="Select date"
      />
      <Title
        level={4}
        style={{ color: "#473a3a", fontSize: "clamp(10px, 2vw, 16px)" }}
      >
        Select Your Day
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
      {alertInfo.visible && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          closable
          onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
          style={{
            position: "fixed",
            top: "20px",
            backgroundColor: "#ff4d4f",
            border: "2px solid rgb(255 86 86)",
            color:'#ebeaea '
          }}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
