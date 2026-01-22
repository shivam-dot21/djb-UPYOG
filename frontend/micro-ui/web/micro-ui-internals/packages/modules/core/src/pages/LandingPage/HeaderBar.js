// import React, { useState, useEffect } from "react";
// import headerConfig from "./configs/headerConfig";
// import ChangeLanguage from "../../components/ChangeLanguage";
// import { useTranslation } from "react-i18next";

// /* =========================
//    🔹 Training Modal (ADD)
// ========================= */
// const TrainingModal = ({ open, onClose }) => {
//   if (!open) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="modal-close" onClick={onClose}>✕</button>

//         <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRyjm4bQkEWVwpc6F0ZQDYEaOw66ngOuCb8FeSorxPM6mredx1T0mvRVhdH0xUguw/pubembed?start=true&loop=true&delayms=3000" frameborder="0" width="1536" height="893" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
//       </div>
//     </div>
//   );
// };

// const HeaderBar = () => {
//   /* =========================
//      🔹 Scroll Logic (UNCHANGED)
//   ========================= */
//   useEffect(() => {
//     let lastScrollY = 0;

//     const handleScroll = () => {
//       const currentScroll = window.scrollY;

//       if (currentScroll > 60 && currentScroll > lastScrollY) {
//         document.body.classList.add("mcd-scrolled");
//       } else if (currentScroll < 40) {
//         document.body.classList.remove("mcd-scrolled");
//       }

//       lastScrollY = currentScroll;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const { t } = useTranslation();
//   const { topBar, branding, navbar } = headerConfig;

//   /* =========================
//      🔹 Existing States
//   ========================= */
//   const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

//   /* =========================
//      🔹 NEW: Training Modal State
//   ========================= */
//   const [showTrainingModal, setShowTrainingModal] = useState(false);

//   return (
//     <React.Fragment>

//       {/* =========================
//          🔹 Internal Styles
//       ========================= */}
//       <style>{`
//         .mcd-top-bar .employee-select-wrap,
//         .employee-select-wrap select,
//         .employee-select-wrap .select__control {
//           margin-top: 2px !important;
//           margin-bottom: 0 !important;
//         }

//         .header-login-dropdown {
//           position: relative;
//           display: inline-block;
//         }

//         .login-dropdown-menu {
//           position: absolute;
//           top: 110%;
//           right: 0;
//           background: #fff;
//           border-radius: 6px;
//           box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
//           width: 180px;
//           z-index: 999;
//         }

//         .dropdown-item {
//           display: block;
//           padding: 10px 14px;
//           color: #333;
//           font-size: 14px;
//           text-decoration: none;
//         }

//         .dropdown-item:hover {
//           background: #f5f5f5;
//         }

//         /* 🔹 Modal Styles */
//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0,0,0,0.6);
//           z-index: 9999;
//         }

//         .modal-content {
//           width: 80%;
//           height: 80%;
//           background: #fff;
//           margin: 5% auto;
//           position: relative;
//           border-radius: 8px;
//           overflow: hidden;
//         }

//         .modal-content iframe {
//           width: 100%;
//           height: 100%;
//         }

//         .modal-close {
//           position: absolute;
//           top: 8px;
//           right: 12px;
//           font-size: 18px;
//           background: none;
//           border: none;
//           cursor: pointer;
//           z-index: 1;
//         }
//       `}</style>

//       {/* =========================
//          🔹 Top Bar
//       ========================= */}
//       <div className="mcd-top-bar">
//         <div className="mcd-top-left">
//           {topBar.showLanguage && (
//             <div style={{ display: "inline-block" }}>
//               <ChangeLanguage dropdown={true} />
//             </div>
//           )}

//           <span className="pipe">|</span>
//           <span>{t(topBar.organizationName)}</span>
//         </div>

//         <div className="mcd-top-right">
//           {topBar.socialLinks.map((item, index) => (
//             <a
//               key={index}
//               href={item.url}import React, { useState, useEffect } from "react";
// import headerConfig from "./configs/headerConfig";
// import ChangeLanguage from "../../components/ChangeLanguage";
// import { useTranslation } from "react-i18next";

// /* =========================
//    🔹 Training Modal (ADD)
// ========================= */
// const TrainingModal = ({ open, onClose }) => {
//   if (!open) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="modal-close" onClick={onClose}>✕</button>

//         <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRyjm4bQkEWVwpc6F0ZQDYEaOw66ngOuCb8FeSorxPM6mredx1T0mvRVhdH0xUguw/pubembed?start=true&loop=true&delayms=3000" frameborder="0" width="1536" height="893" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
//       </div>
//     </div>
//   );
// };

// const HeaderBar = () => {
//   /* =========================
//      🔹 Scroll Logic (UNCHANGED)
//   ========================= */
//   useEffect(() => {
//     let lastScrollY = 0;

//     const handleScroll = () => {
//       const currentScroll = window.scrollY;

//       if (currentScroll > 60 && currentScroll > lastScrollY) {
//         document.body.classList.add("mcd-scrolled");
//       } else if (currentScroll < 40) {
//         document.body.classList.remove("mcd-scrolled");
//       }

//       lastScrollY = currentScroll;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const { t } = useTranslation();
//   const { topBar, branding, navbar } = headerConfig;

//   /* =========================
//      🔹 Existing States
//   ========================= */
//   const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

//   /* =========================
//      🔹 NEW: Training Modal State
//   ========================= */
//   const [showTrainingModal, setShowTrainingModal] = useState(false);

//   return (
//     <React.Fragment>

//       {/* =========================
//          🔹 Internal Styles
//       ========================= */}
//       <style>{`
//         .mcd-top-bar .employee-select-wrap,
//         .employee-select-wrap select,
//         .employee-select-wrap .select__control {
//           margin-top: 2px !important;
//           margin-bottom: 0 !important;
//         }

//         .header-login-dropdown {
//           position: relative;
//           display: inline-block;
//         }

//         .login-dropdown-menu {
//           position: absolute;
//           top: 110%;
//           right: 0;
//           background: #fff;
//           border-radius: 6px;
//           box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
//           width: 180px;
//           z-index: 999;
//         }

//         .dropdown-item {
//           display: block;
//           padding: 10px 14px;
//           color: #333;
//           font-size: 14px;
//           text-decoration: none;
//         }

//         .dropdown-item:hover {
//           background: #f5f5f5;
//         }

//         /* 🔹 Modal Styles */
//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0,0,0,0.6);
//           z-index: 9999;
//         }

//         .modal-content {
//           width: 80%;
//           height: 80%;
//           background: #fff;
//           margin: 5% auto;
//           position: relative;
//           border-radius: 8px;
//           overflow: hidden;
//         }

//         .modal-content iframe {
//           width: 100%;
//           height: 100%;
//         }

//         .modal-close {
//           position: absolute;
//           top: 8px;
//           right: 12px;
//           font-size: 18px;
//           background: none;
//           border: none;
//           cursor: pointer;
//           z-index: 1;
//         }
//       `}</style>

//       {/* =========================
//          🔹 Top Bar
//       ========================= */}
//       <div className="mcd-top-bar">
//         <div className="mcd-top-left">
//           {topBar.showLanguage && (
//             <div style={{ display: "inline-block" }}>
//               <ChangeLanguage dropdown={true} />
//             </div>
//           )}

//           <span className="pipe">|</span>
//           <span>{t(topBar.organizationName)}</span>
//         </div>

//         <div className="mcd-top-right">
//           {topBar.socialLinks.map((item, index) => (
//             <a
//               key={index}
//               href={item.url}
//               className="icon-link"
//               aria-label={item.name}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {item.icon}
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* =========================
//          🔹 Header + Navbar
//       ========================= */}
//       <div className="mcd-header">
//         <div className="branding">
//           <img
//             src={branding.logo}
//             alt={t(branding.alt)}
//             className="mcd-emblem"
//           />
//         </div>

//         <nav className="mcd-nav">
//           {navbar.map((item, index) => {

//             /* 🔹 LOGIN Dropdown (UNCHANGED) */
//             if (item.label === "LOGIN") {
//               return (
//                 <div key={index} className="header-login-dropdown">
//                   <button
//                     className="mcd-search-btn"
//                     onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
//                   >
//                     {t(item.label)}
//                   </button>

//                   {loginDropdownOpen && (
//                     <div className="login-dropdown-menu">
//                       <a href="/citizen/login" className="dropdown-item">
//                         Citizen Login
//                       </a>
//                       <a href="/digit-ui/employee/user/login" className="dropdown-item">
//                         Employee Login
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             /* 🔹 Normal Nav Items (TRAINING intercepted safely) */
//             return (
//               <a
//   key={index}
//   href={item.link}
//   className="nav-hover-btn"
//   onClick={(e) => {
//     if (item.openModal === "TRAINING_PPT") {
//       e.preventDefault();
//       setShowTrainingModal(true);
//     }
//   }}
// >
//   {t(item.label)}
// </a>
//             );
//           })}
//         </nav>
//       </div>

//       {/* =========================
//          🔹 Training Modal Render
//       ========================= */}
//       <TrainingModal
//         open={showTrainingModal}
//         onClose={() => setShowTrainingModal(false)}
//       />
//     </React.Fragment>
//   );
// };

// export default HeaderBar;

//               className="icon-link"
//               aria-label={item.name}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {item.icon}
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* =========================
//          🔹 Header + Navbar
//       ========================= */}
//       <div className="mcd-header">
//         <div className="branding">
//           <img
//             src={branding.logo}
//             alt={t(branding.alt)}
//             className="mcd-emblem"
//           />
//         </div>

//         <nav className="mcd-nav">
//           {navbar.map((item, index) => {

//             /* 🔹 LOGIN Dropdown (UNCHANGED) */
//             if (item.label === "LOGIN") {
//               return (
//                 <div key={index} className="header-login-dropdown">
//                   <button
//                     className="mcd-search-btn"
//                     onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
//                   >
//                     {t(item.label)}
//                   </button>

//                   {loginDropdownOpen && (
//                     <div className="login-dropdown-menu">
//                       <a href="/citizen/login" className="dropdown-item">
//                         Citizen Login
//                       </a>
//                       <a href="/digit-ui/employee/user/login" className="dropdown-item">
//                         Employee Login
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             /* 🔹 Normal Nav Items (TRAINING intercepted safely) */
//             return (
//               <a
//   key={index}
//   href={item.link}
//   className="nav-hover-btn"
//   onClick={(e) => {
//     if (item.openModal === "TRAINING_PPT") {
//       e.preventDefault();
//       setShowTrainingModal(true);
//     }
//   }}
// >
//   {t(item.label)}
// </a>
//             );
//           })}
//         </nav>
//       </div>

//       {/* =========================
//          🔹 Training Modal Render
//       ========================= */}
//       <TrainingModal
//         open={showTrainingModal}
//         onClose={() => setShowTrainingModal(false)}
//       />
//     </React.Fragment>
//   );
// };

// export default HeaderBar;


import React, { useState, useEffect } from "react";
import headerConfig from "./configs/headerConfig";
import ChangeLanguage from "../../components/ChangeLanguage";
import { useTranslation } from "react-i18next";

/* =========================
   🔹 Training Modal (UI ONLY)
========================= */
const TrainingModal = ({ open, onClose }) => {
  if (!open) return null;

  // ESC key close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <iframe
          src="https://docs.google.com/presentation/d/e/2PACX-1vRyjm4bQkEWVwpc6F0ZQDYEaOw66ngOuCb8FeSorxPM6mredx1T0mvRVhdH0xUguw/pubembed?start=true&loop=true&delayms=3000"
          frameBorder="0"
          allowFullScreen
          title="Training Presentation"
        />
      </div>
    </div>
  );
};

/* =========================
   🔹 HeaderBar Component
========================= */
const HeaderBar = () => {
  const { t } = useTranslation();
  const { topBar, branding, navbar } = headerConfig;

  /* =========================
     🔹 States
  ========================= */
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  /* =========================
     🔹 Scroll Hide Header Logic
  ========================= */
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 60 && currentScroll > lastScrollY) {
        document.body.classList.add("mcd-scrolled");
      } else if (currentScroll < 40) {
        document.body.classList.remove("mcd-scrolled");
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     🔹 Body Scroll Lock (Modal)
  ========================= */
  useEffect(() => {
    if (showTrainingModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showTrainingModal]);

  /* =========================
     🔹 Close dropdown on outside click
  ========================= */
  useEffect(() => {
    const close = () => setLoginDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <React.Fragment>
      {/* =========================
         🔹 Internal Styles
      ========================= */}
      <style>{`
        .mcd-top-bar .employee-select-wrap,
        .employee-select-wrap select,
        .employee-select-wrap .select__control {
          margin-top: 2px !important;
          margin-bottom: 0 !important;
        }

        .header-login-dropdown {
          position: relative;
          display: inline-block;
        }

        .login-dropdown-menu {
          position: absolute;
          top: 110%;
          right: 0;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 200px;
          z-index: 999;
        }

        .dropdown-item {
          display: block;
          padding: 10px 14px;
          color: #333;
          font-size: 14px;
          text-decoration: none;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #f5f5f5;
        }
      `}</style>

      {/* =========================
         🔹 Top Bar
      ========================= */}
      <div className="mcd-top-bar">
        <div className="mcd-top-left">
          {topBar.showLanguage && (
            <div style={{ display: "inline-block" }}>
              <ChangeLanguage dropdown />
            </div>
          )}
          <span className="pipe">|</span>
          <span>{t(topBar.organizationName)}</span>
        </div>

        <div className="mcd-top-right">
          {topBar.socialLinks.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="icon-link"
              aria-label={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      {/* =========================
         🔹 Header + Navbar
      ========================= */}
      <div className="mcd-header">
        <div className="branding">
          <img
            src={branding.logo}
            alt={t(branding.alt)}
            className="mcd-emblem"
          />
        </div>

        <nav className="mcd-nav">
          {navbar.map((item, index) => {

            /* =========================
               🔹 LOGIN DROPDOWN
            ========================= */
            if (item.type === "dropdown") {
              return (
                <div
                  key={index}
                  className="header-login-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="mcd-search-btn"
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  >
                    {t(item.label)}
                  </button>

                  {loginDropdownOpen && (
                    <div className="login-dropdown-menu">
                      {item.children?.map((child, idx) => (
                        <a
                          key={idx}
                          href={child.link}
                          className="dropdown-item"
                        >
                          {t(child.label)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            /* =========================
               🔹 NORMAL NAV ITEMS
            ========================= */
            return (
              <a
                key={index}
                href={item.link || "#"}
                className="nav-hover-btn"
                target={item.external ? "_blank" : "_self"}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (item.openModal === "TRAINING_PPT") {
                    e.preventDefault();
                    setShowTrainingModal(true);
                  }
                }}
              >
                {t(item.label)}
              </a>
            );
          })}
        </nav>
      </div>

      {/* =========================
         🔹 Training Modal
      ========================= */}
      <TrainingModal
        open={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
      />
    </React.Fragment>
  );
};

export default HeaderBar;
