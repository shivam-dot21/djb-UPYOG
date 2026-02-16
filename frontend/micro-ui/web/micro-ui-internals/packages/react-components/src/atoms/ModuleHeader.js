import React from "react";

const ModuleHeader = ({ leftContent, breadcrumbs = [], onLeftClick, wrapperClass = "", containerClass = "" }) => {
  return (
    <div className={`module-header ${wrapperClass}`}>
      <div className={`header-bottom-section ${containerClass}`}>
        {/* Left Section */}
        {leftContent && (
          <div className="left-section" onClick={onLeftClick} style={{ cursor: onLeftClick ? "pointer" : "default" }}>
            {leftContent}
          </div>
        )}

        {/* Right Section (Dynamic Breadcrumbs) */}
        <div className="right-section">
          {breadcrumbs.map((item, index) => {
            const Icon = item.icon;

            return (
              <React.Fragment key={index}>
                {Icon && <Icon className="icon home-icon" />}

                {item.label && <span>{item.label}</span>}

                {index !== breadcrumbs.length - 1 && <span className="iconn">&gt;</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
