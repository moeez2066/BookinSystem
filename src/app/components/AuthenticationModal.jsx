import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, Tabs, Alert } from "antd";
import Image from "next/image";
import { useMyContext } from "../MyContext";

const { Text } = Typography;
const { TabPane } = Tabs;

const AuthenticationModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("signin"); // Track active tab
  const { isSignedIn, setIsSignedIn } = useMyContext();
  const { userName, setUserName } = useMyContext();
  const { userRole, setUserRole } = useMyContext();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const url = activeTabKey === "signin" ? "/api/signin" : "/api/signup"; // Call the correct API based on the active tab
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("isSignedIn", "true");
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("userName", data.name || values.name);
        setIsSignedIn(true);
        setUserName(data.name || values.name);
        setUserRole(data.role);
        setAlertInfo({
          visible: true,
          message: data.message || "Sign In / Sign Up successful!",
          type: "success",
        });
        onCancel();
      } else {
        setAlertInfo({
          visible: true,
          message:
            data.message ||
            (activeTabKey === "signin"
              ? "Sign In failed. Please try again."
              : "Sign Up failed. Please try again."),
          type: "error",
        });
      }
    } catch (error) {
      setAlertInfo({
        visible: true,
        message: "Failed to communicate with the server. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  setTimeout(() => {
    if (alertInfo.visible) {
      setAlertInfo({ ...alertInfo, visible: false });
    }
  }, 3000);

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
        centered
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
        bodyStyle={{
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
          <Image
            src="/shaped.webp"
            alt="Logo"
            width={205}
            height={93}
            style={{ backgroundColor: "#baada6", marginBottom: "15px" }}
          />
          <Text style={{ color: "#473a3a" }}>
            Please sign in or sign up to proceed with your registration.
          </Text>
        </div>

        <Tabs
          activeKey={activeTabKey} // Bind active tab to state
          onChange={(key) => setActiveTabKey(key)} // Update the active tab on change
          centered
          tabBarStyle={{
            border: "none",
            borderColor: "#a88a7d",
          }}
          type="line"
        >
          <TabPane tab="Sign In" key="signin">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{ marginTop: "20px" }}
            >
              <Form.Item
                label="Email"
                name="email"
                validateTrigger="onSubmit"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  className="modal-in"
                  autoComplete="off"
                  style={{
                    borderColor: "#473a3a",
                    boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                validateTrigger="onSubmit"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="modal-in"
                  autoComplete="off"
                  style={{
                    borderColor: "#473a3a",
                    boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  autoComplete="off"
                  loading={loading}
                  style={{
                    backgroundColor: "#a88a7d",
                    borderColor: "#a88a7d",
                    color: "#ffffff",
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Sign Up" key="signup">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{ marginTop: "20px" }}
            >
              <Form.Item
                label="Username"
                name="name"
                autoComplete="off"
                validateTrigger="onSubmit"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input
                  placeholder="Enter your username"
                  className="modal-in"
                  autoComplete="off"
                  style={{
                    borderColor: "#473a3a",
                    boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                validateTrigger="onSubmit"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  className="modal-in"
                  autoComplete="off"
                  style={{
                    borderColor: "#473a3a",
                    boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="WhatsApp Number"
                name="whatsapp"
                validateTrigger="onSubmit"
                rules={[
                  {
                    required: true,
                    message: "Please enter your WhatsApp number",
                  },
                  {
                    pattern: /^[0-9]{10,14}$/,
                    message: "Please enter a valid number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your WhatsApp number"
                  className="modal-in"
                  autoComplete="off"
                  style={{
                    borderColor: "#473a3a",
                    boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                validateTrigger="onSubmit"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="modal-in"
                  autoComplete="off"
                  style={{
                    borderColor: "#473a3a",
                    boxShadow: "0 0 5px rgba(71, 58, 58, 0.4)",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    backgroundColor: "#a88a7d",
                    borderColor: "#a88a7d",
                    color: "#ffffff",
                  }}
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
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
            zIndex: 11111,
          }}
        />
      )}
    </>
  );
};

export default AuthenticationModal;
