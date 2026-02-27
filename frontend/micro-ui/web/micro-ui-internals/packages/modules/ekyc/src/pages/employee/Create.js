import React, { useState } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

const Create = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { path } = useRouteMatch();
    const [kNumber, setKNumber] = useState("");
    const [kName, setKName] = useState("");

    const handleContinue = () => {
        // Redirect to K details page, passing the K number as state or param
        const parentPath = path.replace("/create-kyc", "");
        history.push(`${parentPath}/k-details`, { kNumber, kName });
    };

    return (
        <div className="ekyc-create-container">
            <Header>{t("EKYC_CREATE_KYC_HEADER")}</Header>
            <Card>
                <CardHeader>{t("EKYC_ENTER_DETAILS_HEADER")}</CardHeader>

                <LabelFieldPair>
                    <CardLabel>{t("EKYC_K_NUMBER")}</CardLabel>
                    <div className="field">
                        <TextInput
                            value={kNumber}
                            onChange={(e) => setKNumber(e.target.value)}
                            placeholder={t("EKYC_K_NUMBER_PLACEHOLDER")}
                        />
                    </div>
                </LabelFieldPair>

                <LabelFieldPair>
                    <CardLabel>{t("EKYC_K_NAME")}</CardLabel>
                    <div className="field">
                        <TextInput
                            value={kName}
                            onChange={(e) => setKName(e.target.value)}
                            placeholder={t("EKYC_K_NAME_PLACEHOLDER")}
                        />
                    </div>
                </LabelFieldPair>

                <SubmitBar label={t("ES_COMMON_CONTINUE")} onSubmit={handleContinue} />
            </Card>
        </div>
    );
};

export default Create;
