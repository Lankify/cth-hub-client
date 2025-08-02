import React from "react";
import { FiBell, FiSettings, FiSearch } from "react-icons/fi";

const Header: React.FC = () => {
  return (
    <header className="bg-primary sticky top-0 z-10 flex items-center justify-between px-6 py-4">
      {/* Left: Search Bar with Icon */}
      <div className="max-w-md flex-1">
        <div className="relative">
          <FiSearch className="text-secondary-txt absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <input
            type="text"
            placeholder="Search Here..."
            className="bg-secondary placeholder:text-secondary-txt focus:ring-neutral w-full rounded-sm py-2 pr-4 pl-10 shadow-md shadow-black/10 focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Right: Icons + Avatar */}
      <div className="ml-4 flex items-center gap-4">
        {/* Notification Icon */}
        <button className="relative rounded-full p-2 hover:bg-white/10">
          <FiBell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Settings Icon */}
        <button className="rounded-full p-2 hover:bg-white/10">
          <FiSettings className="h-5 w-5" />
        </button>

        {/* Profile Picture */}
        <div className="bg-secondary-txt/30 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
          E
        </div>
      </div>
    </header>
  );
};

export default Header;
