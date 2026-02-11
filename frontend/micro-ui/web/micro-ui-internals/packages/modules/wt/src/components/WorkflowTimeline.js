import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardSubHeader, StatusTable, Row, SubmitBar, LinkButton } from '@upyog/digit-ui-react-components';

const WorkflowTimeline = ({ workflowDetails }) => {
    const { t } = useTranslation();

    if (!workflowDetails || !workflowDetails.data || !workflowDetails.data.timeline) {
        return null;
    }

    const timeline = workflowDetails.data.timeline;

    const getStatusClass = (status, index) => {
        if (index === 0) return 'current';
        // Logic can be expanded based on specific status strings if needed
        return 'completed';
    };

    const convertEpochToDate = (dateEpoch) => {
        if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
            return "NA";
        }
        const dateFromApi = new Date(dateEpoch);
        let month = dateFromApi.getMonth() + 1;
        let day = dateFromApi.getDate();
        let year = dateFromApi.getFullYear();
        month = (month > 9 ? "" : "0") + month;
        day = (day > 9 ? "" : "0") + day;
        return `${day}/${month}/${year}`;
    };

    return (
        <Card className="workflow-timeline-card">
            <CardSubHeader>{t("WORKFLOW_TIMELINE")}</CardSubHeader>
            <div className="timeline-container">
                {timeline.map((checkpoint, index) => {
                    const statusClass = getStatusClass(checkpoint.status, index);

                    return (
                        <div key={index} className={`timeline-item ${statusClass}`}>
                            <div className="timeline-marker">
                                <div className="timeline-circle"></div>
                                {index !== timeline.length - 1 && <div className="timeline-line"></div>}
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-title">
                                    {t(`WF_${checkpoint?.performedAction === "REOPEN" ? checkpoint?.performedAction : checkpoint?.state}`)}
                                </div>
                                <span className="timeline-date">
                                    {convertEpochToDate(checkpoint?.auditDetails?.lastModified)}
                                </span>
                                <div className={`timeline-status-tag status-${statusClass}`}>
                                    {t(checkpoint.status)}
                                </div>
                                <div className="timeline-comment">
                                    {checkpoint?.comment ? t(checkpoint.comment) : t("CS_COMMON_NO_COMMENT")}
                                </div>
                                {checkpoint?.assignes?.length > 0 && (
                                    <div className="timeline-assignee">
                                        <small>{t("ES_COMMON_ASSIGNED_TO")}: {checkpoint?.assignes?.[0]?.name}</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    );
};

export default WorkflowTimeline;
