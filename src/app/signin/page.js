"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Tabs,
  Alert,
  Dropdown,
  Menu,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";

const { Text } = Typography;
const { TabPane } = Tabs;

const SignUpComponent = () => {
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
  const router = useRouter();

  useEffect(() => {
    const signedIn = sessionStorage.getItem("isSignedIn");
    const storedName = sessionStorage.getItem("userName");
    if (signedIn === "true" && storedName) {
      setIsSignedIn(true);
      setUserName(storedName);
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isSignedIn");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userId");
    setIsSignedIn(false);
    setUserName("");
    router.push("/");
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const url = activeTabKey === "signin" ? "/api/signin" : "/api/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("isSignedIn", "true");
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("userName", data.name || values.name);
        setIsSignedIn(true);
        setUserName(data.name || values.name);
        // setAlertInfo({
        //   visible: true,
        //   message: data.message || "Sign In / Sign Up successful!",
        //   type: "success",
        // });

        router.push("/");
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
      console.log(error + "ff");

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

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div style={{ padding: "17px" }}>
        <section
          style={{
            maxWidth: "450px",
            margin: "auto",
            backgroundColor: "#f0eeeb",
            padding: "20px",
            margin: "50px auto",
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
              src="https://mayra.majetics.com/wp-content/uploads/2024/09/logo-removebg_edited_edited.png"
              alt="Logo"
              width={205}
              height={93}
              style={{ backgroundColor: "#baada6", marginBottom: "15px" }}
            />
            <Text style={{ color: "#473a3a" }}>
              Please sign in or sign up to proceed with your registration.
            </Text>
          </div>

          {isSignedIn ? (
            <div style={{ textAlign: "center" }}>
              <Text style={{ fontSize: "16px", color: "#473a3a" }}>
                Welcome, {userName}
              </Text>
              <Dropdown overlay={menu} placement="bottomRight">
                <Button
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#a88a7d",
                    color: "#ffffff",
                  }}
                >
                  Options
                </Button>
              </Dropdown>
            </div>
          ) : (
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
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
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
                left: "50%",
                transform: "translateX(-50%)",
                color: "black",
                zIndex: 11111,
              }}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default SignUpComponent;
