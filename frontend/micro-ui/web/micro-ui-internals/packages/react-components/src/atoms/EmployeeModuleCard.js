import React, { Fragment, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { ArrowRightInbox } from "./svgindex";
import ExpandedViewContext from "./ExpandedViewContext";
import ModuleLinksView from "./ModuleLinksView";
import CollapsibleModuleSidebar from "./CollapsibleModuleSidebar";

const EmployeeModuleCard = ({ Icon, moduleName, kpis = [], links = [], className, styles }) => {
  const history = useHistory();
  const { isExpandedView, isModuleSidebar } = useContext(ExpandedViewContext) || {};

  const handleDetailsClick = () => {
    history.push("/digit-ui/employee/module/details", {
      moduleName,
      links,
    });
  };

  if (isExpandedView) {
    return <ModuleLinksView links={links} moduleName={moduleName} />;
  }

  if (isModuleSidebar) {
    return <CollapsibleModuleSidebar links={links} moduleName={moduleName} Icon={Icon} />;
  }

  const mainKpi = kpis.length > 0 ? kpis[0] : null;
  const secondaryKpis = kpis.length > 1 ? kpis.slice(1) : [];

  return (
    <Fragment>
      {/* Card */}
      <div className={`new-employee-card ${className || ""}`}>
        {/* Header */}
        <div className="card-header-row">
          <h2 className="module-title">{moduleName}</h2>
          <div className="module-icon-wrap">{Icon}</div>
        </div>

        {/* Body */}
        <div className="card-body-row">
          {/* Left: Main KPI */}
          <div className="main-kpi-section">
            {mainKpi && (
              <Fragment>
                <span className="main-kpi-number">{mainKpi.count || "0"}</span>
                <div className="main-kpi-label-wrap">
                  <span className="main-kpi-label">{mainKpi.label}</span>
                </div>
              </Fragment>
            )}
          </div>

          {/* Right: Secondary KPIs */}
          <div className="secondary-kpi-section">
            {secondaryKpis.map((kpi, index) => {
              const isHeader = !kpi.count && kpi.label === kpi.label.toUpperCase();
              return (
                <div key={index} className={`secondary-kpi-item ${isHeader ? "sec-kpi-header" : ""}`}>
                  <span className="sec-kpi-label">{kpi.label}</span>
                  {!isHeader && <span className="sec-kpi-value">{kpi.count ? kpi.count : <span className="sec-kpi-dot"></span>}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-footer-row" style={{ justifyContent: "flex-end", marginTop: "auto" }}>
          <button className="details-btn" onClick={handleDetailsClick}>
            Details
          </button>
        </div>
      </div>
    </Fragment>
  );
};

const ModuleCardFullWidth = ({ moduleName, links = [], isCitizen = false, className, styles, headerStyle, subHeader, subHeaderLink }) => {
  const history = useHistory();

  const handleDetailsClick = () => {
    history.push("/digit-ui/employee/module/details", {
      moduleName,
      links,
    });
  };

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
                {link ? link?.includes("digit-ui/") ? <Link to={link}>{label}</Link> : <a href={link}>{label}</a> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployeeModuleCard, ModuleCardFullWidth };
