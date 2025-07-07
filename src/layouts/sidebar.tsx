import React, { type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiClipboard, FiUsers, FiBox } from "react-icons/fi";
import { sidebarNavs } from "./data";
import logo from "../assets/logo.png";

const iconMap: { [key: string]: JSX.Element } = {
  Dashboard: <FiHome />,
  "Hotel Rates": <FiClipboard />,
  Clients: <FiUsers />,
  Inventory: <FiBox />,
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 z-20 h-screen p-5 shadow-md bg-secondary text-primary-txt w-70 shadow-black/10">
      <div className="mb-10">
        {/* <img src={logo} alt="CTH Hub Logo" className="object-contain w-auto" /> */}
        <img src={logo} alt="CTH Hub Logo" className="ml-1 w-38" />
      </div>
      <nav>
        <ul className="space-y-4">
          {sidebarNavs.map(item => {
            const isActive = location.pathname === item.navigation;

            return (
              <li key={item.navigation}>
                <Link
                  to={item.navigation}
                  className={`flex items-center gap-2 rounded-sm px-3 py-2 transition-all ${
                    isActive
                      ? "bg-opacity-10 border-neutral text-neutral border-l-4 bg-white/5 font-medium"
                      : "hover:text-primary-txt hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{iconMap[item.title] || <span className="w-5" />}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
