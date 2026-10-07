import React, { useState, useEffect } from "react";
import { CardLabel, Dropdown, FormStep, LabelFieldPair, Loader, RadioOrSelect } from "@djb25/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const SelectGender = ({ config, onSelect, t, userType, formData }) => {
  const stateId = Digit.ULBService.getStateId();
  const { data: genderDataV2, isLoading: isV2Loading } = Digit.Hooks.useCommonMDMSV2(stateId, "common-masters", ["GenderType"]);
  // const { data: GenderDataV1, isLoading: isV1Loading } = Digit.Hooks.fsm.useMDMS(stateId, "common-masters", "FSMGenderType");
  const [genderType, setGenderType] = useState(formData?.genderType || formData?.gender);

  const genderList = genderDataV2?.["common-masters"]?.GenderType || genderDataV2?.MdmsRes?.["common-masters"]?.GenderType;
  const GenderData = genderList?.length
    ? genderList.filter((data) => data.active).map((genderDetails) => ({
      ...genderDetails,
      i18nKey: `COMMON_GENDER_${genderDetails.code}`,
      value: `${genderDetails.code}`,
    }))
    : [];

  const isLoading = !GenderData && isV2Loading;

  useEffect(() => {
    if (!isLoading && GenderData) {
      const preFilledGenderType = GenderData.filter(
        (genderType) => genderType.code === (formData?.selectGender?.code || formData?.selectGender || formData?.gender?.code)
      )[0];
      setGenderType(preFilledGenderType);
    }
  }, [formData?.selectGender, GenderData]);

  const selectGenderType = (value) => {
    setGenderType(value);
    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("genderDetail", null);
    }
  };

  const onSkip = () => {
    onSelect();
  };

  const onSubmit = () => {
    onSelect(config.key, genderType);
  };

  if (isLoading) {
    return <Loader />;
  }

  const isRegistry = window.location.pathname.includes("/registry/");

  if (isRegistry) {
    const selectedValue = GenderData?.find(
      (option) => option.code === (formData?.[config.key]?.code || formData?.[config.key] || genderType?.code || genderType)
    ) || null;

    return (
      <LabelFieldPair>
        <CardLabel>
          {t(config.label)}
          {config.isMandatory ? <span className="check-page-link-button"> * </span> : ""}
        </CardLabel>
        <Dropdown
          className="payment-form-text-input-correction"
          isMandatory={config.isMandatory}
          selected={selectedValue}
          option={GenderData}
          select={(value) => {
            setGenderType(value);
            onSelect(config.key, value);
          }}
          optionKey="i18nKey"
          disable={config.disable}
          t={t}
        />
      </LabelFieldPair>
    );
  }

  if (userType === "employee") {
    return (
      <LabelFieldPair>
        <CardLabel>{t(config.label)}</CardLabel>
        <Dropdown
          className="payment-form-text-input-correction"
          isMandatory={config.isMandatory}
          selected={genderType}
          option={GenderData?.sort((a, b) => a.code.localeCompare(b.code))}
          select={selectGenderType}
          optionKey="i18nKey"
          disable={config.disable}
          t={t}
        />
      </LabelFieldPair>
    );
  }
  return (
    <React.Fragment>
      <Timeline currentStep={2} flow="APPLY" />
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!genderType} t={t}>
        <RadioOrSelect
          options={GenderData?.sort((a, b) => a.code.localeCompare(b.code))}
          selectedOption={genderType}
          optionKey="i18nKey"
          onSelect={selectGenderType}
          t={t}
          isMandatory={config.isMandatory}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectGender;
