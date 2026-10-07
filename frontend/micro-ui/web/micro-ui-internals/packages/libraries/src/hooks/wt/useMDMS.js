import { MdmsServiceV2 } from "../../services/elements/MDMSV2";
import { useQuery } from "react-query";

const useWTMDMS = (tenantId, moduleCode, type, config = {}) => {

  const queryConfig = { staleTime: Infinity, ...config };

  const vehicleTypeQuery = useQuery(
    "WT_VEHICLE_TYPE",
    () => MdmsServiceV2.getVehicleType(tenantId, moduleCode, type),
    queryConfig
  );

  switch (type) {
    case "VehicleMakeModel":
      return vehicleTypeQuery;

    case "VehicleType":
      return vehicleTypeQuery;

    default:
      return null;
  }
};

export default useWTMDMS;