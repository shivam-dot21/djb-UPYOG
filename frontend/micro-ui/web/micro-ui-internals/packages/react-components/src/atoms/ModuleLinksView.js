import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const ModuleLinksView = ({ links = [], moduleName }) => {
    return (
        <div className="expanded-content">
            <div className="content-header">
                <h2 className="content-title">{moduleName}</h2>
            </div>

            <div className="content-section-title">Quick Actions & Services</div>

            <div className="content-links-list">
                {links && links.length > 0 ? (
                    links.map((linkItem, index) => {
                        const label = linkItem.label;
                        const count = linkItem.count;
                        const url = linkItem.link;

                        const Content = (
                            <div className="content-link-row">
                                <span className="link-label">
                                    {label} {count ? <span className="link-count">({count})</span> : ""}
                                </span>
                                <span className="link-arrow">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </span>
                            </div>
                        );

                        return (
                            <div key={index} className="link-wrapper">
                                {url ? (
                                    url.includes('digit-ui') ? <Link to={url}>{Content}</Link> : <a href={url}>{Content}</a>
                                ) : (
                                    <div style={{ cursor: 'default' }}>{Content}</div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="no-links-msg">No actions available for this module.</div>
                )}
            </div>
        </div>
    );
};

export default ModuleLinksView;
