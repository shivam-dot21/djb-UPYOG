import { Dropdown, Hamburger, TopBar as TopBarComponent } from "@upyog/digit-ui-react-components";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import ChangeCity from "../ChangeCity";
import ChangeLanguage from "../ChangeLanguage";

const TextToImg = (props) => (
  <span className="user-img-txt" onClick={props.toggleMenu} title={props.name}>
    {props?.name?.[0]?.toUpperCase()}
  </span>
);
const TopBar = ({
  t,
  stateInfo,
  toggleSidebar,
  isSidebarOpen,
  handleLogout,
  userDetails,
  CITIZEN,
  cityDetails,
  mobileView,
  userOptions,
  handleUserDropdownSelection,
  logoUrl,
  showLanguageChange = true,
  setSideBarScrollTop,
}) => {
  const [profilePic, setProfilePic] = React.useState(null);

  React.useEffect(async () => {
    const tenant = Digit.ULBService.getCurrentTenantId();
    const uuid = userDetails?.info?.uuid;
    if (uuid) {
      const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
      if (usersResponse && usersResponse.user && usersResponse.user.length) {
        const userDetails = usersResponse.user[0];
        const thumbs = userDetails?.photo?.split(",");
        setProfilePic(thumbs?.at(0));
      }
    }
  }, [profilePic !== null, userDetails?.info?.uuid]);

  const CitizenHomePageTenantId = Digit.ULBService.getCitizenCurrentTenant(true);

  let history = useHistory();
  const { pathname } = useLocation();

  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (Digit.UserService?.getUser()?.info?.type === "CITIZEN") {
      if (!CitizenHomePageTenantId) return false;
      else return true;
    }
    return false;
  };

  const { data: { unreadCount: unreadNotificationCount } = {}, isSuccess: notificationCountLoaded } = Digit.Hooks.useNotificationCount({
    tenantId: CitizenHomePageTenantId,
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });

  const updateSidebar = () => {
    if (!Digit.clikOusideFired) {
      toggleSidebar(true);
      setSideBarScrollTop(true);
    } else {
      Digit.clikOusideFired = false;
    }
  };

  function onNotificationIconClick() {
    history.push("/digit-ui/citizen/engagement/notifications");
  }

  const urlsToDisableNotificationIcon = (pathname) =>
    !!Digit.UserService?.getUser()?.access_token
      ? false
      : ["/digit-ui/citizen/select-language", "/digit-ui/citizen/select-location"].includes(pathname);

  if (CITIZEN) {
    const loggedIn = userDetails?.access_token ? true : false;
    return (
      <div className="topbar">
        {mobileView ? <Hamburger handleClick={updateSidebar} color="#9E9E9E" /> : null}
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <img
            className="city"
            src="https://objectstorage.ap-hyderabad-1.oraclecloud.com/n/axn3czn1s06y/b/djb-dev-asset-bucket/o/DJB_integrated_logo_without_bg_dark.png"
          />

          {!mobileView && (
            <div className="flex-right right w-80 column-gap-15">
              <div className="left">{showLanguageChange && <ChangeLanguage dropdown={true} />}</div>
              <div style={{ width: "2px", height: "28px", backgroundColor: "rgb(203, 213, 225" }}></div>

              {loggedIn && (
                <div className="left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <CustomUserDropdown
                    userOptions={userOptions}
                    roleOptions={[]}
                    selectedRole={null}
                    handleRoleChange={() => { }}
                    profilePic={profilePic}
                    userName={userDetails?.info?.name || userDetails?.info?.userInfo?.name || "Citizen"}
                    t={t}
                  />
                </div>
              )}

              <img className="state" src="https://objectstorage.ap-hyderabad-1.oraclecloud.com/n/axn3czn1s06y/b/djb-dev-asset-bucket/o/SBM_IMG.png" />
            </div>
          )}
        </span>
      </div>
    );
  }
  const loggedin = userDetails?.access_token ? true : false;
  return (
    <div className="topbar">
      {mobileView ? <Hamburger handleClick={toggleSidebar} color="#9E9E9E" /> : null}
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <img
          className="city"
          src="https://objectstorage.ap-hyderabad-1.oraclecloud.com/n/axn3czn1s06y/b/djb-dev-asset-bucket/o/DJB_integrated_logo_without_bg_dark.png"
        />

        {!loggedin && (
          <p className="ulb" style={mobileView ? { fontSize: "14px", display: "inline-block" } : {}}>
            {t(`MYCITY_${stateInfo?.code?.toUpperCase()}_LABEL`)} {t(`MYCITY_STATECODE_LABEL`)}
          </p>
        )}
        {!mobileView && (
          <div className={mobileView ? "right" : "flex-right right w-80 column-gap-15"} style={!loggedin ? { width: "80%" } : {}}>
            <div className="left">
              {!window.location.href.includes("employee/user/login") && !window.location.href.includes("employee/user/language-selection") && (
                <ChangeCity dropdown={true} t={t} />
              )}
            </div>
            <div className="left">{showLanguageChange && <ChangeLanguage dropdown={true} />}</div>
            {userDetails?.access_token && (
              <div className="left">
                <Dropdown
                  option={userOptions}
                  optionKey={"name"}
                  select={handleUserDropdownSelection}
                  showArrow={true}
                  freeze={true}
                  style={mobileView ? { right: 0 } : {}}
                  optionCardStyles={{ overflow: "revert" }}
                  customSelector={
                    profilePic == null ? (
                      <TextToImg name={userDetails?.info?.name || userDetails?.info?.userInfo?.name || "Employee"} />
                    ) : (
                      <img src={profilePic} style={{ height: "48px", width: "48px", borderRadius: "50%" }} />
                    )
                  }
                />
              </div>
            )}
            <img className="state" src="https://objectstorage.ap-hyderabad-1.oraclecloud.com/n/axn3czn1s06y/b/djb-dev-asset-bucket/o/DJB_integrated_logo_without_bg_dark.png" />
          </div>
        )}
      </span>
    </div>
  );
};

export default TopBar;
