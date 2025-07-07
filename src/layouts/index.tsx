import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="ml-[280px] flex w-full flex-col">
        <Header />
        <main className="flex-1 px-6 py-4 overflow-y-auto bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
