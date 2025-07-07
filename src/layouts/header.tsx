import React from "react";
import { FiBell, FiSettings, FiSearch } from "react-icons/fi";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 shadow-sm bg-primary text-primary-txt">
      {/* Left: Search Bar with Icon */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute w-4 h-4 transform -translate-y-1/2 text-secondary-txt top-1/2 left-3" />
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full py-2 pl-10 pr-4 rounded-sm shadow-md bg-secondary text-primary-txt placeholder:text-secondary-txt focus:ring-neutral shadow-black/10 focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Right: Icons + Avatar */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification Icon */}
        <button className="relative p-2 rounded-full hover:bg-white/10">
          <FiBell className="w-5 h-5" />
          <span className="absolute block w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
        </button>

        {/* Settings Icon */}
        <button className="p-2 rounded-full hover:bg-white/10">
          <FiSettings className="w-5 h-5" />
        </button>

        {/* Profile Picture */}
        <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full bg-secondary-txt/30 text-primary-txt">
          E
        </div>
      </div>
    </header>
  );
};

export default Header;
