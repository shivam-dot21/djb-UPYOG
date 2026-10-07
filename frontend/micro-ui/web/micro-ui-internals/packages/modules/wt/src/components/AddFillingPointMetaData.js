import React from "react";
import { LabelFieldPair, CardLabel, CardLabelError, TextInput, CollapsibleCardPage } from "@djb25/digit-ui-react-components";

const AddFillingPointMetaData = ({
  t,
  formData = {},
  onSelect,
  config = {},
  visibleFields = [], // ✅ control fields from parent
}) => {
  const sectionKey = config?.key || "metaData";
  // ✅ ALL FIELDS CONFIG
  const inputs = [
    {
      label: "WT_FILLING_POINT_NAME",
      name: "fillingPointName",
      isMandatory: true,
    },

    // AE
    {
      label: "WT_AE_NAME",
      name: "aeName",
      isMandatory: true,
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      },
    },
    {
      label: "WT_AE_MOBILE_NUMBER",
      name: "aeMobile",
      isMandatory: true,
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "^[6-9][0-9]{9}$",
        type: "tel",
        maxLength: 10,
        title: "CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID",
      },
    },
    {
      label: "WT_AE_EMAIL_ID",
      name: "aeEmail",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
      },
    },

    // JE
    {
      label: "WT_JE_NAME",
      name: "jeName",
      isMandatory: true,
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      },
    },
    {
      label: "WT_JE_MOBILE_NUMBER",
      name: "jeMobile",
      isMandatory: true,
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "^[6-9][0-9]{9}$",
        type: "tel",
        maxLength: 10,
        title: "CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID",
      },
    },
    {
      label: "WT_JE_EMAIL_ID",
      name: "jeEmail",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
      },
    },

    // EE
    {
      label: "WT_EE_NAME",
      name: "eeName",
      isMandatory: true,
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      },
    },
    {
      label: "WT_EE_MOBILE_NUMBER",
      name: "eeMobile",
      isMandatory: true,
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "^[6-9][0-9]{9}$",
        type: "tel",
        maxLength: 10,
        title: "CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID",
      },
    },
    {
      label: "WT_EE_EMAIL_ID",
      name: "eeEmail",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
      },
    },
  ];

  // ✅ FILTER FIELDS (core logic)
  const filteredInputs = visibleFields && visibleFields.length > 0 ? inputs.filter((input) => visibleFields.includes(input.name)) : inputs;

  // ✅ SINGLE CHANGE HANDLER
  const handleChange = (value, name) => {
    if (!onSelect) return;

    let newValue = value;
    if (["aeMobile", "jeMobile", "eeMobile", "alternateNumber"].includes(name)) {
      newValue = value.slice(0, 10).replace(/[^0-9]/g, "");
    }

    onSelect(sectionKey, {
      ...formData?.[sectionKey],
      [name]: newValue,
    });
  };

  return (
    <CollapsibleCardPage title={"Filling Point Details"} defaultOpen={true}>
      <div className="formcomposer-section-grid">
        {filteredInputs.map((input) => (
          <div key={input.name}>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t(input.label)}
                {input.isMandatory ? <span className="check-page-link-button" style={{ color: "red", fontWeight: "bold" }}> * </span> : ""}
              </CardLabel>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                  {input.componentInFront || null}

                  <TextInput
                    value={formData?.[sectionKey]?.[input.name] || ""}
                    onChange={(e) => handleChange(e.target.value, input.name)}
                    maxLength={input.validation?.maxLength}
                    {...input.validation}
                  />
                </div>
                {["aeMobile", "jeMobile", "eeMobile"].includes(input.name) &&
                  formData?.[sectionKey]?.[input.name] &&
                  !/^[6-9]\d{9}$/.test(formData?.[sectionKey]?.[input.name]) && (
                    <CardLabelError style={{ marginTop: "4px" }}>
                      {t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}
                    </CardLabelError>
                )}
              </div>
            </LabelFieldPair>
          </div>
        ))}
      </div>
    </CollapsibleCardPage>
  );
};

export default AddFillingPointMetaData;
