import React from "react";
import { useHistory } from "react-router-dom";

const ModuleHeader = ({ leftContent, breadcrumbs = [], onLeftClick, wrapperClass = "", containerClass = "" }) => {
  const history = useHistory();

  return (
    <div className={`module-header ${wrapperClass}`}>
      <div className={`header-bottom-section ${containerClass}`}>
        
        {/* Left Section */}
        {leftContent && (
          <div
            className="left-section"
            onClick={onLeftClick}
            style={{ cursor: onLeftClick ? "pointer" : "default" }}
          >
            {leftContent}
          </div>
        )}

        {/* Right Section (Dynamic Breadcrumbs) */}
        <div className="right-section">
          {breadcrumbs.map((item, index) => {
            const Icon = item.icon;

            const handleClick = () => {
              if (item.path) {
                history.push(item.path);
              } else if (item.onClick) {
                item.onClick();
              }
            };

            return (
              <React.Fragment key={index}>
                
                {/* Icon Clickable */}
                {Icon && (
                  <Icon
                    className="icon home-icon"
                    onClick={handleClick}
                    style={{ cursor: item.path || item.onClick ? "pointer" : "default" }}
                  />
                )}

                {/* Label Clickable */}
                {item.label && (
                  <span
                    onClick={handleClick}
                    style={{ 
                      cursor: item.path || item.onClick ? "pointer" : "default",
                      marginLeft: "4px"
                    }}
                  >
                    {item.label}
                  </span>
                )}

                {index !== breadcrumbs.length - 1 && (
                  <span className="iconn"> &gt; </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;