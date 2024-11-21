import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import {FooterCentered} from "./Footer.jsx";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <FooterCentered/>
    </div>
  );
};

export default Layout;
