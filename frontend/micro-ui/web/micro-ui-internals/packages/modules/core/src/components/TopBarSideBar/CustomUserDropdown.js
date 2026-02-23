import React, { useState } from "react";
import { ArrowDown, EditPencilIcon, LogoutIcon } from "@upyog/digit-ui-react-components";

const TextToImg = (props) => (
  <span className="user-img-txt" onClick={props.toggleMenu} title={props.name}>
    {props?.name?.[0]?.toUpperCase()}
  </span>
);

const CustomUserDropdown = ({ userOptions, roleOptions = [], selectedRole, handleRoleChange, profilePic, userName, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= (768 || 480 || 320 || 1024));

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= (768 || 480 || 320 || 1024));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    if (option.func) {
      option.func();
      setIsOpen(false);
    }
  };

  const handleRoleSelect = (role) => {
    handleRoleChange(role);
    setIsRoleDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* User Avatar */}
      <div onClick={toggleDropdown} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
        {!profilePic ? (
          <TextToImg name={userName || "Employee"} />
        ) : (
          <img src={profilePic} style={{ height: "48px", width: "60px", borderRadius: "2px" }} />
        )}
        <ArrowDown className="icon" style={{ width: "16px", height: "16px" }} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <div
            onClick={() => {
              setIsOpen(false);
              setIsRoleDropdownOpen(false);
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />

          {/* Main Dropdown Content */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              minWidth: "220px",
              zIndex: 999,
              overflow: "hidden",
            }}
          >
            {/* Edit Profile */}
            <div
              onClick={() => handleOptionClick(userOptions[0])}
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                borderBottom: "1px solid #e0e0e0",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <EditPencilIcon className="icon" style={{ width: "16px", height: "16px" }} />
              <span>{userOptions[0]?.name}</span>
            </div>

            {/* Logout */}
            <div
              onClick={() => handleOptionClick(userOptions[1])}
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              <LogoutIcon className="icon" style={{ width: "16px", height: "16px" }} />
              <span>{userOptions[1]?.name}</span>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default CustomUserDropdown;
