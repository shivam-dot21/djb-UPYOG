import React, { useEffect, useState } from "react";
import { initKeycloak, getKeycloak } from "./keyCloak";

const Satyam = () => {
  const kc = getKeycloak();
  const name = kc?.tokenParsed?.preferred_username;

  const handleLogout = () => {
    console.log("Logout clicked");

    kc.logout({
      redirectUri: `${window.location.origin}/digit-ui`
    })
      .then(() => console.log("Logout triggered"))
      .catch(err => console.error("Logout error:", err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome {name || "User"} 🚀</h1>
      <button
        onClick={handleLogout}
        style={{ marginTop: 20, padding: "10px 20px", fontSize: 16 }}
      >
        Logout
      </button>
    </div>
  );
};

const Login = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initKeycloak(() => setReady(true));
  }, []);

  if (!ready) return <p>Authenticating...</p>;
  return <Satyam />;
};

export default Login;



// import React, { useEffect, useState } from "react";
// import { initKeycloak, getKeycloak } from "./keyCloak";
// import { useHistory } from "react-router-dom";

// const Login = () => {
//   const [ready, setReady] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);
//   const history = useHistory();
//   const { data: cities, isLoading } = Digit.Hooks.useTenants();
//   const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
//   const { stateInfo } = storeData || {};
//   const [user, setUser] = useState(null);
//   const [showToast, setShowToast] = useState(null);
//   const [disable, setDisable] = useState(false);

//   const setEmployeeDetail = (userObject, token) => {
//     let locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";
//     localStorage.setItem("Employee.tenant-id", userObject?.tenantId);
//     localStorage.setItem("tenant-id", userObject?.tenantId);
//     localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
//     localStorage.setItem("locale", locale);
//     localStorage.setItem("Employee.locale", locale);
//     localStorage.setItem("token", token);
//     localStorage.setItem("Employee.token", token);
//     localStorage.setItem("user-info", JSON.stringify(userObject));
//     localStorage.setItem("Employee.user-info", JSON.stringify(userObject));
//   };

//   let sourceUrl = "https://s3.ap-south-1.amazonaws.com/egov-qa-assets";
//   const pdfUrl = "https://pg-egov-assets.s3.ap-south-1.amazonaws.com/Upyog+Code+and+Copyright+License_v1.pdf";

//   // Initialize Keycloak
//   useEffect(() => {
//     initKeycloak(() => {
//       const kc = getKeycloak();
//       if (kc?.authenticated) {
//         setReady(true);
//         setAuthenticated(true);
//       } else {
//         setReady(true);
//         // Optionally redirect to login if not authenticated
//         console.error("User not authenticated");
//       }
//     });
//   }, []);

//   // Fetch user details after Keycloak is ready
//   useEffect(() => {
//     if (!ready || !authenticated) {
//       return;
//     }

//     const fetchUserDetails = async () => {
//       try {
//         const kc = getKeycloak();
//         const token = kc.token;
        
//         // Fetch user info from your backend
//         // Replace this with your actual API endpoint
//         const response = await fetch("/user/oauth/token", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username: kc.tokenParsed?.preferred_username,
//             tenantId: kc.tokenParsed?.tenantId || "pg", // Default tenant
//             userType: "EMPLOYEE",
//           }),
//         });

//         const userData = await response.json();
        
//         setUser({
//           access_token: token,
//           info: userData.UserRequest || userData.user || userData,
//         });
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//         setShowToast({ error: true, message: "Failed to load user details" });
//       }
//     };

//     fetchUserDetails();
//   }, [ready, authenticated]);

//   // Handle navigation after user is loaded
//   useEffect(() => {
//     if (!user || !user.info) {
//       return;
//     }

//     try {
//       // Set up session storage
//       Digit.SessionStorage.set("citizen.userRequestObject", user);
      
//       // Filter roles by tenant
//       const tenantId = Digit.SessionStorage.get("Employee.tenantId") || user.info.tenantId;
//       const filteredRoles = user?.info?.roles?.filter((role) => role.tenantId === tenantId);
      
//       if (filteredRoles && filteredRoles.length > 0) {
//         user.info.roles = filteredRoles;
//       }
      
//       // Set user in Digit service
//       Digit.UserService.setUser(user);
      
//       // Set employee details in storage
//       setEmployeeDetail(user.info, user.access_token);
      
//       // Determine redirect path
//       let redirectPath = "/digit-ui/employee";

//       /* Logic to redirect back to same screen where we left off */
//       if (window?.location?.href?.includes("from=")) {
//         redirectPath = decodeURIComponent(window?.location?.href?.split("from=")?.[1]) || "/digit-ui/employee";
//       }

//       /* Logic to navigate to National DSS home if user has only NATADMIN role */
//       if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "NATADMIN")) {
//         redirectPath = "/digit-ui/employee/dss/landing/NURT_DASHBOARD";
//       }
      
//       /* Logic to navigate to State DSS home if user has only STADMIN role */
//       if (user?.info?.roles && user?.info?.roles?.length > 0 && user?.info?.roles?.every((e) => e.code === "STADMIN")) {
//         redirectPath = "/digit-ui/employee/dss/landing/home";
//       }

//       // Small delay to ensure all state is updated
//       setTimeout(() => {
//         history.replace(redirectPath);
//       }, 100);
      
//     } catch (error) {
//       console.error("Error setting up user:", error);
//       setShowToast({ error: true, message: "Failed to set up user session" });
//     }
//   }, [user, history]);

//   if (!ready) {
//     return (
//       <div style={{ padding: 20, textAlign: "center" }}>
//         <p>Authenticating with Keycloak...</p>
//       </div>
//     );
//   }

//   if (!authenticated) {
//     return (
//       <div style={{ padding: 20, textAlign: "center" }}>
//         <p>Authentication failed. Please try again.</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div style={{ padding: 20, textAlign: "center" }}>
//         <p>Loading user details...</p>
//       </div>
//     );
//   }

//   // This shouldn't render since we redirect, but just in case
//   return <h1>satyam</h1>;
// };

// export default Login;