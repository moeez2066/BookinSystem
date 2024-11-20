"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./Navbar.module.css";
import { Button, Dropdown, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

export default function Navbar() {
  const { isSignedIn, setIsSignedIn } = useMyContext();
  const { userName, setUserName } = useMyContext();
  const { userRole, setUserRole } = useMyContext();
  const router = useRouter();
  useEffect(() => {
    const signedIn = sessionStorage.getItem("isSignedIn");
    const storedName = sessionStorage.getItem("userName");
    const storedRole = sessionStorage.getItem("userRole");
    if (signedIn === "true" && storedName && storedRole) {
      setIsSignedIn(true);
      setUserName(storedName);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isSignedIn");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userId");
    setIsSignedIn(false);
    setUserName("");
    setUserRole("");
    router.push("/");
  };

  const getDashboardLink = () => {
    if (userRole === "client") return "/user";
    if (userRole === "admin") return "/admin";
    if (userRole === "trainer") return "/trainer";
    return "/";
  };

  const menu = (
    <Menu>
      <Menu.Item key="dashboard">
        <Link href={getDashboardLink()}>
          <ProfileOutlined
            style={{ fontSize: "17px", marginBottom: "-12px" }}
          />
          &nbsp;Dashboard
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined style={{ fontSize: "17px", marginBottom: "-12px" }} />
        &nbsp;Logout
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
                <UserOutlined color="white" style={{ color: "#f0eeeb" }} />
                <span style={{ color: "#f0eeeb" }}>{userName}</span>
                <DownOutlined
                  style={{ color: "#f0eeeb", marginBottom: "-4px" }}
                />
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
