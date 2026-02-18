import React from "react";

import {
  initPGRComponents,
  PGRReducers,
} from "@nudmcdgnpm/digit-ui-module-pgr";
import { initFSMComponents } from "@upyog/digit-ui-module-fsm";
import { FinanceModule } from "@mcd89/digit-ui-module-finance";
// import {
//   PTModule,
//   PTLinks,
//   PTComponents,
// } from "@upyog/digit-ui-module-pt";
import { MCollectModule, MCollectLinks, initMCollectComponents } from "@upyog/digit-ui-module-mcollect";
import { initDSSComponents } from "@upyog/digit-ui-module-dss";
import {
  PaymentModule,
  PaymentLinks,
  paymentConfigs,
} from "@upyog/digit-ui-module-common";
import { DigitUI } from "@upyog/digit-ui-module-core";
import { initLibraries } from "@nudmcdgnpm/digit-ui-libraries";
import {
  HRMSModule,
  initHRMSComponents,
} from "@djb25/digit-ui-module-hrms";
// import {
//   TLModule,
//   TLLinks,
//   initTLComponents,
// } from "@upyog/digit-ui-module-tl";
import { initReceiptsComponents, ReceiptsModule } from "@upyog/digit-ui-module-receipts";
// import { initOBPSComponents } from "@upyog/digit-ui-module-obps";
// import { initNOCComponents } from "@upyog/digit-ui-module-noc";
import { initEngagementComponents } from "@upyog/digit-ui-module-engagement";
// import { initWSComponents } from "@upyog/digit-ui-module-ws";
import { initFinanceComponents } from "@mcd89/digit-ui-module-finance";
// import { initCustomisationComponents } from "./Customisations";
import { initCommonPTComponents } from "@upyog/digit-ui-module-commonpt";
import { initBillsComponents } from "@upyog/digit-ui-module-bills";
// import {
//   PTRModule,
//   PTRLinks,
//   PTRComponents,
// } from "@nudmcdgnpm/upyog-ui-module-ptr";
import { ASSETComponents, ASSETLinks, ASSETModule } from "@djb25/digit-ui-module-asset";

// import { 
//   EWModule, 
//   EWLinks, 
//   EWComponents }
//   from "@nudmcdgnpm/upyog-ui-module-ew";

// import { SVComponents, SVLinks, SVModule } from "@nudmcdgnpm/upyog-ui-module-sv";
// import {CHBModule,CHBLinks,CHBComponents} from "@nudmcdgnpm/upyog-ui-module-chb";
// import {ADSModule,ADSLinks,ADSComponents} from "@nudmcdgnpm/upyog-ui-module-ads";
// import { WTModule, WTLinks, WTComponents } from "@nudmcdgnpm/upyog-ui-module-wt";
import { VENDORComponents, VENDORLinks, VENDORModule } from "@nudmcdgnpm/upyog-ui-module-vendor";
// import { initReportsComponents } from "@upyog/digit-ui-module-reports";

initLibraries();

const enabledModules = [
  "PGR",
  "FSM",
  "Payment",
  // "PT",
  "QuickPayLinks",
  "DSS",
  "NDSS",
  "MCollect",
  "HRMS",
  // "TL",
  "Receipts",
  // "OBPS",
  // "NOC",
  "Engagement",
  "Finance",
  "CommonPT",
  // "WS",
  "Reports",
  "Bills",
  // "SW",
  "BillAmendment",
  "FireNoc",
  "Birth",
  "Death",
  // "PTR",
  "ASSET",
  // "ADS",
  // "SV",
  // "EW",
  // "CHB",
  // "WT",
  "VENDOR",
  "MT"
];
window.Digit.ComponentRegistryService.setupRegistry({
  ...paymentConfigs,
  // PTModule,
  // PTLinks,
  PaymentModule,
  PaymentLinks,
  // ...PTComponents,
  MCollectLinks,
  MCollectModule,
  HRMSModule,
  FinanceModule,
  // TLModule,
  // TLLinks,
  ReceiptsModule,
  // PTRModule,
  // PTRLinks,
  // ...PTRComponents,
  ASSETModule,
  ASSETLinks,
  ...ASSETComponents,
  // ADSLinks,
  // ADSModule,
  // ...ADSComponents,
  // SVModule,
  // SVLinks,
  // ...SVComponents,
  // EWModule,
  // EWLinks,
  // ...EWComponents,
  // CHBModule,
  // CHBLinks,
  // ...CHBComponents,
  // WTModule,
  // WTLinks,
  // ...WTComponents,
  VENDORModule,
  VENDORLinks,
  ...VENDORComponents
});

initPGRComponents();
initFSMComponents();
initDSSComponents();
initMCollectComponents();
initHRMSComponents();
// initTLComponents();
initReceiptsComponents();
// initOBPSComponents();
// initNOCComponents();
initEngagementComponents();
// initWSComponents();
initCommonPTComponents();
initBillsComponents();
initFinanceComponents();
// initAssetComponents();
// initReportsComponents();
// initCustomisationComponents();

const moduleReducers = (initData) => ({
  pgr: PGRReducers(initData),
});

function App() {
  window.contextPath =
    window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      moduleReducers={moduleReducers}
    />
  );
}

export default App;

// import React from "react";

// import { initPGRComponents, PGRReducers } from "@upyog/digit-ui-module-pgr";
// import { initFSMComponents } from "@upyog/digit-ui-module-fsm";
// import {
//   MCollectModule,
//   MCollectLinks,
//   initMCollectComponents,
// } from "@upyog/digit-ui-module-mcollect";
// import { initDSSComponents } from "@upyog/digit-ui-module-dss";
// import {
//   PaymentModule,
//   PaymentLinks,
//   paymentConfigs,
// } from "@upyog/digit-ui-module-common";
// import { DigitUI } from "@upyog/digit-ui-module-core";
// import { initLibraries } from "@upyog/digit-ui-libraries";
// import { HRMSModule, initHRMSComponents } from "@djb25/digit-ui-module-hrms";
// import {
//   initReceiptsComponents,
//   ReceiptsModule,
// } from "@upyog/digit-ui-module-receipts";
// import { initEngagementComponents } from "@upyog/digit-ui-module-engagement";
// import { initWSComponents , WSModule, WSLinks} from "@djb25/digit-ui-module-ws";
// // import { initCustomisationComponents } from "./Customisations";
// import { initCommonPTComponents } from "@upyog/digit-ui-module-commonpt";
// import { initBillsComponents } from "@upyog/digit-ui-module-bills";
// import { PTRModule, PTRLinks, PTRComponents } from "@upyog/upyog-ui-module-ptr";
// import { ASSETModule, initAssetComponents , ASSETLinks, ASSETComponents} from "@djb25/digit-ui-module-asset";

// import { WTModule, WTLinks, WTComponents , initWTComponents} from "@djb25/digit-ui-module-wt";
// import {
//   VENDORComponents,
//   VENDORLinks,
//   VENDORModule,
// } from "@nudmcdgnpm/upyog-ui-module-vendor";
// import {
//   PGRAIComponents,
//   PGRAILinks,
//   PGRAIModule,
// } from "@nudmcdgnpm/upyog-ui-module-pgrai";
// // import { initReportsComponents } from "@upyog/digit-ui-module-reports";

// initLibraries();

// const enabledModules = [
//   "Tqm",
//   "PGR",
//   "FSM",
//   "Payment",
//   "QuickPayLinks",
//   "DSS",
//   "NDSS",
//   "MCollect",
//   "HRMS",
//   "Receipts",
//   "Engagement",
//   "CommonPT",
//   "WS",
//   "Reports",
//   "Bills",
//   "SW",
//   "BillAmendment",
//   "FireNoc",
//   "Birth",
//   "Death",
//   "PTR",
//   "ASSET",
//   "WT",
//   "VENDOR",
//   "MT",
//   "VENDOR",
//   "PGRAI",
//   "TP",
// ];
// window.Digit.ComponentRegistryService.setupRegistry({
//   ...paymentConfigs,
//   PaymentModule,
//   PaymentLinks,
//   MCollectLinks,
//   MCollectModule,
//   HRMSModule,
//   ReceiptsModule,
//   PTRModule,
//   PTRLinks,
//   ...PTRComponents,
//   ASSETModule,
//   ASSETLinks,
//   ...ASSETComponents,
//   WTModule,
//   WTLinks,
//   ...WTComponents,
//   VENDORModule,
//   VENDORLinks,
//   ...VENDORComponents,
//   PGRAIModule,
//   PGRAILinks,
//   ...PGRAIComponents,
//   WSModule,
//   WSLinks,
// });

// initPGRComponents();
// initFSMComponents();
// initDSSComponents();
// initMCollectComponents();
// initHRMSComponents();
// initReceiptsComponents();
// initEngagementComponents();
// initWSComponents();
// initCommonPTComponents();
// initBillsComponents();
// initAssetComponents();
// initWTComponents();
// // initReportsComponents();
// // initCustomisationComponents();

// const moduleReducers = (initData) => ({
//   pgr: PGRReducers(initData),
// });

// function App() {
//   window.contextPath =
//     window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
//   const stateCode =
//     window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
//     process.env.REACT_APP_STATE_LEVEL_TENANT_ID;

//   if (!stateCode) {
//     return <h1>stateCode is not defined</h1>;
//   }
//   return (
//     <DigitUI
//       stateCode={stateCode}
//       enabledModules={enabledModules}
//       moduleReducers={moduleReducers}
//     />
//   );
// }

// export default App;
