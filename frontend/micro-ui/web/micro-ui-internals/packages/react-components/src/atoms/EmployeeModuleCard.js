import React, { Fragment } from "react";
import { ArrowRightInbox } from "./svgindex";
import { Link } from "react-router-dom";

const EmployeeModuleCard = ({ Icon, moduleName, kpis = [], links = [], className, styles }) => {
  // Extract the first KPI for the massive number + label on the left
  const mainKpi = kpis.length > 0 ? kpis[0] : null;
  
  // Extract the rest of the KPIs for the right-side list
  const secondaryKpis = kpis.length > 1 ? kpis.slice(1) : [];

  return (
    <div className={`new-employee-card ${className || ''}`} style={styles}>

      {/* --- TOP HEADER --- */}
      <div className="card-header-row">
        <h2 className="module-title">{moduleName}</h2>
        <div className="module-icon-wrap">
          {Icon}
        </div>
      </div>

      {/* --- MIDDLE BODY --- */}
      <div className="card-body-row">

        {/* Left Side: Main Large KPI */}
        <div className="main-kpi-section">
          {mainKpi && (
            <Fragment>
              <span className="main-kpi-number">{mainKpi.count || "0"}</span>
              <div className="main-kpi-label-wrap">
                <div className="trend-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </div>
                <span className="main-kpi-label">{mainKpi.label}</span>
              </div>
            </Fragment>
          )}
        </div>

        {/* Right Side: Secondary KPIs List */}
        <div className="secondary-kpi-section">
          {secondaryKpis.map((kpi, index) => {
            // Check if it's a header row like "URGENT TASKS" (usually has no count and no link)
            const isHeader = !kpi.count && kpi.label === kpi.label.toUpperCase();
            
            return (
              <div key={index} className={`secondary-kpi-item ${isHeader ? 'sec-kpi-header' : ''}`}>
                <span className="sec-kpi-label">{kpi.label}</span>
                {!isHeader && (
                  <span className="sec-kpi-value">
                    {/* Render number if it exists, otherwise render the red dot */}
                    {kpi.count ? kpi.count : <span className="sec-kpi-dot"></span>}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- BOTTOM FOOTER --- */}
      <div className="card-footer-row">
        <div className="footer-links">
          {links.map((linkItem, index) => (
            linkItem.link ? (
              <Link key={index} to={linkItem.link} className="pill-link">
                {linkItem.label}
              </Link>
            ) : (
              <span key={index} className="pill-link">{linkItem.label}</span>
            )
          ))}
        </div>
        <button className="details-btn">Details</button>
      </div>

    </div>
  );
};

const ModuleCardFullWidth = ({ moduleName, links = [], isCitizen = false, className, styles, headerStyle, subHeader, subHeaderLink }) => {
  return (
    <div className={className ? className : "employeeCard card-home customEmployeeCard home-action-cards"} style={styles ? styles : {}}>
      <div className="complaint-links-container" style={{ padding: "10px" }}>
        <div className="header" style={isCitizen ? { padding: "0px" } : headerStyle}>
          <span className="text removeHeight">{moduleName}</span>
          <span className="link">
            <a href={subHeaderLink}>
              <span className={"inbox-total"} style={{ display: "flex", alignItems: "center", color: "#a82227", fontWeight: "bold" }}>
                {subHeader || "-"}
                <span style={{ marginLeft: "10px" }}>
                  {" "}
                  <ArrowRightInbox />
                </span>
              </span>
            </a>
          </span>
        </div>
        <div className="body" style={{ margin: "0px", padding: "0px" }}>
          <div className="links-wrapper" style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
            {links.map(({ count, label, link }, index) => (
              <span className="link full-employee-card-link" key={index}>
                {link ? (link?.includes('digit-ui/') ? <Link to={link}>{label}</Link> : <a href={link}>{label}</a>) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployeeModuleCard, ModuleCardFullWidth };