import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { matchPath, useLocation, Switch } from "react-router-dom";

import DashboardComp from "components/dashboard";
import PageNotFound from "components/pageNotFound";
import CustomRoute from "components/customRoute";
import { getPermissions } from "redux/permission/action";
import { logout } from "redux/auth/action";
import { removeMessage, toggleLocale } from "redux/util/action";
import SIDEBAR from "./sidebar";
import ROUTES from "./routes";
import CONSTANTS from "../../constants";
import { arrayToObject, isTokenExpired } from "../../utils";
import useOnOutsideClick from "../../hooks/useOnOutsideClick";

const {
  ACCESS_MAPPING: { PROCESS, CREATE, VIEW, EDIT, DELETE }
} = CONSTANTS;

const PREFERENCE_LIST = [VIEW, CREATE, EDIT, PROCESS, DELETE];

const matchPermission = routes => {
  return id => {
    for (let i = 0; i < PREFERENCE_LIST.length; i++) {
      const testModule = `${id}:${PREFERENCE_LIST[i]}`;
      if (testModule in routes) {
        return routes[testModule].path;
      }
    }
  };
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(SIDEBAR[0].id);
  const [sidebar, setSidebar] = useState([]);
  const [submenuMapping, setSubmenuMapping] = useState({});
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [togglesideMenu, setToggleSideMenu] = useState(false);
  const [businessdropdown, setbusinessDropDown] = useState(false);

  const name = useSelector(state => state.business.name);
  const permissions = useSelector(state => state.permissions.permissions);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const locale = useSelector(state => state.utils.locale);
  const messages = useSelector(state => state.utils.messages);

  const businessRef = useRef();

  useOnOutsideClick(businessRef, () => {
    setbusinessDropDown();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired(refreshToken)) {
        dispatch(logout());
      }
    }, 1000 * 10);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        await dispatch(getPermissions());
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [dispatch]);

  useEffect(() => {
    if (permissions) {
      const allowedMenu = [];
      const _submenuMapping = {};
      const allowedRoutes = [];

      ROUTES.forEach(route => {
        const [module, action] = route.permission.split(":");

        if (permissions[module]?.[action]) {
          allowedRoutes.push({
            ...route,
            modulePermission: permissions[module]
          });
        }
      });

      const routesObj = arrayToObject(allowedRoutes, "permission");
      const getModulePermission = matchPermission(routesObj);

      SIDEBAR.forEach(menu => {
        const { permission, submenu } = menu;
        const newMenu = { ...menu };
        let newSubMenu = [];

        if (submenu) {
          newSubMenu = submenu
            .filter(({ permission }) => permission in permissions)
            .map(item => ({
              ...item,
              path: getModulePermission(item.permission)
            }));

          Object.assign(newMenu, {
            submenu: newSubMenu
          });

          submenu.forEach(item => {
            _submenuMapping[item.permission] = menu.id;
          });
        }

        if (permission in permissions || newSubMenu.length !== 0) {
          Object.assign(newMenu, { path: getModulePermission(permission) });
          allowedMenu.push(newMenu);
        }
      });

      setSubmenuMapping(_submenuMapping);
      setAllowedRoutes(allowedRoutes);
      setSidebar(allowedMenu);
    }
  }, [permissions]);

  useEffect(() => {
    const { pathname } = location;

    const selectedRoute = (ROUTES || []).filter(route =>
      matchPath(pathname, route)
    )[0];

    if (selectedRoute) {
      const { permission } = selectedRoute;

      setActiveMenu(permission.split(":")[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleChangeMenu = (e, key) => {
    e.stopPropagation();
    setActiveMenu(key);
  };

  const handleSignOut = () => {
    dispatch(logout());
  };

  const handleChangeLocale = () => {
    dispatch(toggleLocale(locale));
  };

  const handleSidebarCollapse = () => {
    setToggleSideMenu(!togglesideMenu);
  };

  const handleDropDown = () => {
    setbusinessDropDown(!businessdropdown);
  };

  const handleDashboardClick = () => {
    if (messages.length > 0) {
      dispatch(removeMessage());
    }
  };

  return (
    <DashboardComp
      name={name}
      locale={locale}
      loading={loading}
      sidebarMenu={sidebar}
      activeMenu={activeMenu}
      submenuMapping={submenuMapping}
      handleSignOut={handleSignOut}
      handleMenuChange={handleChangeMenu}
      handleChangeLocale={handleChangeLocale}
      handleDashboardClick={handleDashboardClick}
      handleSidebarCollapse={handleSidebarCollapse}
      togglesideMenu={togglesideMenu}
      handleDropDown={handleDropDown}
      businessdropdown={businessdropdown}
      businessRef={businessRef}
    >
      <Switch>
        {allowedRoutes.map((props, index) => (
          <CustomRoute isProtected {...props} key={`key-${index}`} />
        ))}
        <CustomRoute path="*" component={PageNotFound} />
      </Switch>
    </DashboardComp>
  );
}
