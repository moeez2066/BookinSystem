import React, { useState } from "react";
import { Button, Select, Typography, Space } from "antd";
import "./CalendarComponent.css";

const { Title, Text } = Typography;
const { Option } = Select;

const CalendarComponent = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
  ];

  const handleDayClick = (day) => {
    setSelectedDay(day);
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
      <span className="desktop-only-br">
        {" "}
        <br />
      </span>
      {selectedDay ? (
        <div style={{ marginTop: "10px" }}>
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
            {timeSlots.map((slot) => (
              <Option key={slot} value={slot} label={slot}>
                {slot}
              </Option>
            ))}
          </Select>
        </div>
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
            style={{ color: "#473a3a", fontSize: "clamp(8px, 1.5vw, 14px)" }}
          >
            You selected <strong>{selectedSlots[selectedDay]}</strong> on{" "}
            <strong>{selectedDay}</strong>
          </Text>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
