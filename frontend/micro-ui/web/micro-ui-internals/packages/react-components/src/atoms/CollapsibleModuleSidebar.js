import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const CollapsibleModuleSidebar = ({ links = [], moduleName = "Dashboard", Icon }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const location = useLocation();

    return (
        <aside className={`premium-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {/* Header Section */}
            <div className="sidebar-header">
                <div className="brand-container">
                    <div className="brand-icon">
                        {Icon || <div className="default-icon"></div>}
                    </div>
                    <h2 className="brand-name">{moduleName}</h2>
                </div>

                <button
                    className="collapse-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label="Toggle Sidebar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isCollapsed ? (
                            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" /> // Double arrow right
                        ) : (
                            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" /> // Double arrow left
                        )}
                    </svg>
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="sidebar-nav">
                {links.map((linkItem, index) => {
                    const isActive = location.pathname === linkItem.link;
                    const initials = linkItem.label.substring(0, 2).toUpperCase();

                    const LinkContent = (
                        <div className="nav-item-content">
                            <div className="nav-icon-wrapper">
                                {linkItem.icon ? linkItem.icon : <span className="fallback-initial">{initials}</span>}
                            </div>
                            <span className="nav-text">{linkItem.label}</span>
                        </div>
                    );

                    return (
                        <div
                            key={index}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            title={isCollapsed ? linkItem.label : ""}
                        >
                            {linkItem.link ? (
                                linkItem.link.includes('digit-ui') ?
                                    <Link to={linkItem.link} className="nav-link">{LinkContent}</Link> :
                                    <a href={linkItem.link} className="nav-link">{LinkContent}</a>
                            ) : (
                                <div className="nav-link disabled">{LinkContent}</div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default CollapsibleModuleSidebar;