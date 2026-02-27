import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, LinkLabel, Dropdown, SubmitBar } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchApplication = ({ onSearch, searchFields, searchParams }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues: searchParams,
    });

    const onSubmitInput = (data) => {
        onSearch(data);
    };

    function clearSearch() {
        const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
        reset(resetValues);
        onSearch({ ...resetValues });
    }

    return (
        <form onSubmit={handleSubmit(onSubmitInput)} className="ekyc-search-container">
            <div className="search-inner">
                <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
                    {searchFields?.map((input) => (
                        <div key={input.name} style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "250px" }}>
                            <Label style={{ marginBottom: 0, marginTop: "20px" }}>{input.label}</Label>
                            {input.type === "dropdown" ? (
                                <Controller
                                    control={control}
                                    name={input.name}
                                    render={(props) => (
                                        <Dropdown
                                            selected={props.value}
                                            select={(val) => {
                                                props.onChange(val);
                                            }}
                                            onBlur={props.onBlur}
                                            option={input.options}
                                            optionKey={input.optionsKey}
                                            t={t}
                                        />
                                    )}
                                />
                            ) : (
                                <TextInput {...input} inputRef={register} watch={watch} />
                            )}
                        </div>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <SubmitBar label={t("ES_COMMON_SEARCH")} submit={true} style={{ height: "40px", padding: "0 24px", marginBottom: "0" }} />
                        <LinkLabel onClick={clearSearch} style={{ margin: 0, marginTop: "60px" }}>{t("ES_COMMON_CLEAR_ALL")}</LinkLabel>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SearchApplication;
