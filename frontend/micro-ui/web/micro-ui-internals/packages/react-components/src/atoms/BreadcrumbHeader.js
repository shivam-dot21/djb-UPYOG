import React from "react";
import { Link, useHistory } from "react-router-dom";
import LinkButton from "./LinkButton";

export default function BreadcrumbHeader({ leftContent, breadcrumbs = [], onLeftClick, wrapperClass = "", containerClass = "" }) {
  const history = useHistory();

  const visibleCrumbs = breadcrumbs?.filter((crumb) => crumb?.show);

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

        <ol className="right-section">
          {visibleCrumbs?.map((crumb, ci) => {
            const isLastItem = ci === visibleCrumbs.length - 1;

            if (crumb?.isBack) {
              return (
                <li key={ci} className="bread-crumb--item">
                  <span style={{ cursor: "pointer" }} onClick={() => window.history.back()}>
                    {crumb.content}
                  </span>
                </li>
              );
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
      </div>
    </div>
  );
}
