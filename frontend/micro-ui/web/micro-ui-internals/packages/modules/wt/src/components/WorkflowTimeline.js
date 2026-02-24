import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardSubHeader } from '@djb25/digit-ui-react-components';

// --- Icons ---

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// UPDATED CLOCK ICON
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    {/* Added className 'clock-hands2' */}
    <polyline className="clock-hands2" points="12 6 12 12 16 14"></polyline>
  </svg>
);

const WorkflowTimeline = ({ workflowDetails }) => {
    const { t } = useTranslation();

    if (!workflowDetails?.data?.timeline) {
        return null;
    }

    const timeline = workflowDetails.data.timeline;

    // Updated to return status with '2' suffix
    const getStatusClass = (status, index) => {
        if (index === 0) return 'current2';
        return 'completed2';
    };

    const convertEpochToDate = (dateEpoch) => {
        if (!dateEpoch) return "N/A";
        const date = new Date(dateEpoch);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
        <Card className="workflow-timeline-card2 digit-form-composer" style={{ background: '#fafafa', padding: '16px' }}>
            <CardSubHeader style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700', color: '#374151' }}>
                {t("WORKFLOW_TIMELINE")}
            </CardSubHeader>
            
            <div className="timeline-container2">
                {timeline.map((checkpoint, index) => {
                    const statusClass = getStatusClass(checkpoint.status, index);
                    // Hide line for last item
                    const showLine = index !== timeline.length - 1 && timeline.length > 1;

                    return (
                        <div key={index} className={`timeline-item2 ${statusClass}`}>
                            <div className="timeline-marker2">
                                <div className="timeline-circle2">
                                    {statusClass === 'completed2' ? <CheckIcon /> : <ClockIcon />}
                                </div>
                                {showLine && <div className="timeline-line2"></div>}
                            </div>

                            <div className="timeline-content2">
                                <div className="timeline-header2">
                                    <div className="timeline-title2">
                                        {t(`WF_${checkpoint?.performedAction === "REOPEN" ? checkpoint?.performedAction : checkpoint?.state}`)}
                                    </div>
                                    <span className="timeline-date2">
                                        {convertEpochToDate(checkpoint?.auditDetails?.lastModified)}
                                    </span>
                                </div>

                                <div className="timeline-body2">
                                    {/* statusClass is now 'completed2' or 'current2', creating 'status-completed2' etc */}
                                    <div className={`timeline-status-tag2 status-${statusClass}`}>
                                        {t(checkpoint.status)}
                                    </div>
                                    
                                    {checkpoint?.comment && (
                                       <div className="timeline-comment2">
                                           {t(checkpoint.comment)}
                                       </div>
                                    )}
                                </div>

                                {checkpoint?.assignes?.length > 0 && (
                                    <div className="timeline-footer2">
                                        <span>
                                            {t("ES_COMMON_ASSIGNED_TO")}: <strong>{checkpoint?.assignes?.[0]?.name}</strong>
                                        </span>
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