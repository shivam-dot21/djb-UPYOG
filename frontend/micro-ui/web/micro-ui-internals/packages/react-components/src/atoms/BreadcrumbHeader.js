import React from "react";
import { Link, useHistory } from "react-router-dom";
import LinkButton from "./LinkButton";

export default function BreadcrumbHeader({ leftContent, breadcrumbs = [], onLeftClick, wrapperClass = "", containerClass = "" }) {
  const history = useHistory();
  const visibleCrumbs = breadcrumbs?.filter((crumb) => crumb?.show);

  const rightContent = visibleCrumbs?.find((ele) => ele?.rightContent)?.rightContent;

  return (
    <div className={`module-header ${wrapperClass}`}>
      <div className={`header-bottom-section ${containerClass}`}>
        {/* Left Section */}
        {leftContent && (
          <div className="left-section" onClick={onLeftClick} style={{ cursor: onLeftClick ? "pointer" : "default" }}>
            {leftContent}
          </div>
        )}

        {/* Right Section Wrapper */}
        <div className="right-section-wrapper">
          {/* Breadcrumbs */}
          <ol className="right-section">
            {visibleCrumbs?.map((crumb, ci) => {
              const isLastItem = ci === visibleCrumbs.length - 1;

              if (crumb?.isBack) {
                const parts = crumb.content.split("/").map((p) => p.trim());
                return parts.map((part, index) => (
                  <React.Fragment key={`${ci}-${index}`}>
                    <li className="bread-crumb-item">
                      <span style={{ cursor: "pointer" }} onClick={() => window.history.back()}>
                        {part.replace(/\//g, "").trim()}
                      </span>
                    </li>

                    {index !== parts.length - 1 && (
                      <li className="bread-crumb-separator">
                        <span className="iconn">&gt;</span>
                      </li>
                    )}
                  </React.Fragment>
                ));
              }

              return (
                <React.Fragment key={ci}>
                  <li>
                    {isLastItem || !crumb?.path || crumb?.isclickable === false ? (
                      <span>{crumb.content}</span>
                    ) : crumb?.isredirected ? (
                      <span
                        onClick={() =>
                          history.push(crumb?.path?.pathname, {
                            ...crumb?.path?.state,
                          })
                        }
                      >
                        <LinkButton label={crumb.content} />
                      </span>
                    ) : (
                      <Link to={crumb.path}>{crumb.content}</Link>
                    )}
                  </li>

                  {!isLastItem && (
                    <li className="bread-crumb-separator">
                      <span className="iconn">&gt;</span>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ol>

          {/* ✅ Extra Right Content */}
          {rightContent && <div className="extra-right-content">{rightContent}</div>}
        </div>
      </div>
    </div>
  );
}
