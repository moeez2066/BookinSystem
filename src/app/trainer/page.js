"use client";
import React, { useState } from "react";
import { Typography, Tabs } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;

const TrainerPanel = () => {
  const [activeTabKey, setActiveTabKey] = useState("Profile");

  return (
    <div style={{ padding: "17px" }}>
      <section
        style={{
          maxWidth: "850px",
          margin: "50px auto",
          backgroundColor: "#f0eeeb",
          padding: "20px",
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
            level={2}
            style={{
              color: "white",
              backgroundColor: "#baada6",
              padding: "12px",
            }}
          >
            Client Panel
          </Title>
        </div>

        <Tabs
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)}
          centered
          tabBarStyle={{
            border: "none",
            borderColor: "#a88a7d",
          }}
          type="line"
        >
          <TabPane tab="Profile" key="Profile"></TabPane>
          <TabPane tab="Bookings" key="Bookings"></TabPane>
        </Tabs>
      </section>
    </div>
  );
};

export default TrainerPanel;
