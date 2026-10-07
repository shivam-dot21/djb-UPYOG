import { useQuery } from "react-query";
import { MdmsServiceV2 as MdmsService } from "../../services/elements/MDMSV2";

const useConfig = (tenantId) => {
  return useQuery("FSM_CUSTOMIZATION_CONFIG", async () => {
    const res = await MdmsService.getCustomizationConfig(tenantId, "FSM");
    const configList = res?.["FSM"]?.Config || res?.MdmsRes?.["FSM"]?.Config || [];
    return configList
      .filter((item) => item.active === true)
      .reduce(
        (finalObject, itemConfig) =>
          Object.assign(finalObject, {
            [itemConfig.code]: {
              override: itemConfig.override,
              default: itemConfig.default,
              state: itemConfig.WFState,
            },
          }),
        {}
      );
  });
};

export default useConfig;
