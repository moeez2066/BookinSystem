"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Button, Dropdown, Menu, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Navbar() {
  const { isSignedIn, setIsSignedIn } = useMyContext();
  const { userName, setUserName } = useMyContext();
  const router = useRouter();

  useEffect(() => {
    const signedIn = sessionStorage.getItem("isSignedIn");
    const storedName = sessionStorage.getItem("userName");
    if (signedIn === "true" && storedName) {
      setIsSignedIn(true);
      setUserName(storedName);
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

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navItem}>
          HOME
        </Link>
        <Link href="/about" className={styles.navItem}>
          ABOUT US
        </Link>
        <div className={styles.logoContainer}>
          <Image
            src="https://mayra.majetics.com/wp-content/uploads/2024/09/logo-removebg_edited_edited.png"
            alt="Logo"
            width={205}
            height={93}
            className={styles.logo}
          />
        </div>
        <Link href="/products" className={styles.navItem}>
          PRODUCTS
        </Link>
        <Link href="/book" className={styles.navItem}>
          BOOK NOW
        </Link>
      </div>
      <div className={styles.navBtn}>
        {isSignedIn ? (
          <div style={{ textAlign: "center" }}>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#a88a7d",
                  color: "#ffffff",
                  border: "none",
                  color: "white",
                }}
              >
                <UserOutlined color="white" style={{ color: "#f0eeeb" }} />{" "}
                <span style={{ color: "#f0eeeb" }}>{userName}</span>
                <DownOutlined style={{color:'#f0eeeb'}} />
              </Button>
            </Dropdown>
          </div>
        ) : (
          <Link href="/signin">
            <Button type="default" className={styles.navButton}>
              Signin
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
