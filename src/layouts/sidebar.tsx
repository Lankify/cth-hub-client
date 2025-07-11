import React, { type JSX, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiClipboard, FiUsers, FiBox, FiChevronDown } from "react-icons/fi";
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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubMenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="fixed top-0 left-0 z-20 h-screen p-5 shadow-md bg-secondary w-70 shadow-black/10">
      <div className="mb-10">
        {/* <img src={logo} alt="CTH Hub Logo" className="object-contain w-auto" /> */}
        <img src={logo} alt="CTH Hub Logo" className="ml-1 w-38" />
      </div>
      <nav>
        <ul className="space-y-4">
          {sidebarNavs.map(item => {
            // const isActive = location.pathname === item.navigation;
            const isSubActive = item.subLinks?.some(sub => location.pathname === sub.navigation);
            const isActive = location.pathname === item.navigation || isSubActive;
            const hasSubMenu = item.subLinks && item.subLinks.length > 0;
            const isOpen = openMenus[item.title];

            return (
              <li key={item.navigation}>
                <div
                  className={`flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2 transition-all ${
                    isActive
                      ? "bg-opacity-10 border-neutral text-neutral border-l-4 bg-white/5 font-medium"
                      : "hover:text-primary-txt hover:bg-white/5"
                  }`}
                >
                  <Link to={item.navigation} className="flex items-center flex-grow gap-2">
                    <span className="text-lg">{iconMap[item.title] || <span className="w-5" />}</span>
                    <span>{item.title}</span>
                  </Link>

                  {hasSubMenu && (
                    <div
                      onClick={() => toggleSubMenu(item.title)}
                      className="p-1 text-sm transition-transform cursor-pointer hover:opacity-80"
                    >
                      <FiChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  )}
                </div>

                {/* Submenu */}
                {hasSubMenu && isOpen && (
                  <ul className="mt-2 space-y-2 ml-7">
                    {item.subLinks?.map(sub => (
                      <li key={sub.navigation}>
                        <Link
                          to={sub.navigation}
                          className={`block rounded px-2 py-2 text-sm hover:bg-white/5 ${
                            location.pathname === sub.navigation ? "text-neutral" : "text-primary-txt"
                          }`}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
