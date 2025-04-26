import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import c from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      // Prevent redirect loop from parfume route
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/parfume");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className={c.headerContainer}>
      <nav className={c.nav}>
        <Link to="/order">Order</Link>
        <Link to="/parfume">Parfume</Link>
      </nav>
      <div className={c.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default Header;
