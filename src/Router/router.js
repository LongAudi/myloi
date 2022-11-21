import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserLayout from "../containers/UserLayout";
import Login from "../containers/Login";
import Cookies from "universal-cookie";
import NotPermission from "../containers/notPermission";
import LoadingPage from "../containers/loadingpage";
import NotFoundLayout from "../containers/notfound";
import { NotValidTime } from "../containers/notValidTime";
import { CustomLayout } from "../containers/Layout";
import { authSuccess } from "../app/Actions/auth";

import { getUserInfo } from "../app/Reducers/getUserInfo";

import ThongTinCaNhan from "../containers/component/ThongTinCaNhan";
import Forgot from "../containers/Forgot";
import Mail from "../containers/component/Mail";

const cookies = new Cookies();

function Main() {
  const dispatch = useDispatch();
  // const userInfo = useSelector((state) => state.getUserInfo.userInfo);
  const [isValid, setIsValid] = useState(true);
  const [isSuperA, setIsSuperA] = useState(false);
  const [lsPermissions, setLsPermissions] = useState(["Member"]);

  const token = cookies.get("token");
  if (token) {
    dispatch(authSuccess(token));
  }
  const auth = useSelector((state) => state.auth.token) !== null;
  const userInfo = useSelector((state) => state.getUserInfo.userInfo);
  useEffect(() => {
    if (auth && token) {
      dispatch(getUserInfo());
    }
  }, [auth, token]);

  useEffect(() => {
    if (userInfo) {
      // console.log(userInfo.group_name);
      setIsSuperA(userInfo.is_superuser);
      setLsPermissions([userInfo.group_name]);

      //     if (userInfo.team_permissions){
      //         const arrTeam = userInfo.team_permissions .map((item,index)=>item.phanquyen__ten_pq);
      //         setLsPermissions([...userInfo.user_permissions, ...new Set(arrTeam)]);
      //     } else {
      //         setLsPermissions(userInfo.user_permissions)
      //     }
    }
    // console.log(userInfoURL);
    // if (userInfo && userInfo.user_permissions) {
    //     setLsPermissions(userInfo.user_permissions)
    // }
    // authAxios().get(userInfoURL).then(r=>{
    //     console.log(r.data.user_permissions);
    //     setLsPermissions(r.data.user_permissions);
    // })
  }, [userInfo]);

  return (
    <Router>
      <Switch>
        <Route path="/forgot" component={Forgot} />
        <ProtectLoginRoute
          exact
          path="/Login"
          protect={auth}
          user_info={userInfo}
        >
          <UserLayout>
            <Login />
          </UserLayout>
        </ProtectLoginRoute>
        <RouteWithLayout
          component={Mail}
          exact
          layout={CustomLayout}
          path="/"
          isPrivate={true}
          lsPermissions={[""]}
          permission={[""]}
          isLogged={auth}
          isValid={isValid}
        />
        {/* <RouteWithLayout
          component={NotPermission}
          exact
          layout={CustomLayout}
          path="/notpermission"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={"403"}
          isLogged={auth}
          isValid={isValid}
          isSuperA={isSuperA}
        />
        <RouteWithLayout
          component={NotFoundLayout}
          layout={CustomLayout}
          path="/"
          lsPermissions={lsPermissions}
          isPrivate={true}
          isLogged={auth}
          permission={"404"}
          isValid={isValid}
          isSuperA={isSuperA}
        /> */}
      </Switch>
    </Router>
  );
}


const RouteWithLayout = props => {
  const {layout: Layout,isLogged:isLogged, component: Component, isPrivate: isPrivate,isValid:isValid, lsPermissions:lsPermissions, permission:permission, ...rest} = props;
  const getRejectRoute = (type)=>{
      switch (type) {
          case '403': return <NotPermission/>
          case '404': return <NotFoundLayout/>
          default:return <NotPermission/>
      }
  }
      return (
          <Route
              {...rest}
              render={() =>
                  isValid ?
                  (isPrivate ? (
                      isLogged ?
                          (lsPermissions && lsPermissions.length > 0 ?
                              (lsPermissions.some(r=> permission.includes(r)) ?
                                  <Layout isLogged={isLogged}>
                                      <Component {...props} />
                                  </Layout>
                                  :
                                      getRejectRoute(permission)
                                  )
                              :
                              (<span></span>)
                          )
                       : (
                          <Redirect
                              to={{
                                  pathname: "/login",
                                  state: {from: props.location}
                              }}
                          />
                      )
                  ) : (
                      <Layout isLogged={isLogged}>
                          <Component {...props}/>
                      </Layout>
                  ))
                      : (
                              <NotValidTime isValid={isValid}/>
                      )
              }
          />
      )
}

const ProtectLoginRoute = ({protect,children,...rest})=>{
  return (
    <Route
      {...rest}
      render = {()=> !protect ? (

        children
      ):
        (
          <Redirect to='/'></Redirect>
        )
      }
    />
  )
}


export default Main;
