import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
// import { RootState } from "../store";

const ProtectedRoute = (props) => {
  const auth = useSelector((state) => state.auth);

  if (auth.account) {
    console.log(auth.account)
    if (props.path === "/login") {
      return <Outlet />;
    }
    return <Outlet />;
  } else if (!auth.account && auth.account.is_active === false) {
    return <Navigate to={"/login"} />;
  } else {
    return <div>Not found</div>;
  }
};

// const ProtectedRoute = (props) => {
//   const auth = useSelector((state) => state.auth);

//   if (auth.account) {
//     if (props.path === "/login") {
//       return <Navigate to={"/"} />;
//     }
//     return <Route {...props} />;
//   } else if (!auth.account) {
//     return <Navigate to={"/login"} />;
//   } else {
//     return <div>Not found</div>;
//   }
// };

export default ProtectedRoute;