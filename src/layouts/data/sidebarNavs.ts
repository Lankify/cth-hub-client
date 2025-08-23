import type { IMainMenu } from "../types";

export const sidebarNavs: IMainMenu[] = [
  {
    title: "Dashboard",
    navigation: "/",
  },
  {
    title: "Hotel Rates",
    navigation: "/hotels",
    subLinks: [
      { title: "Summer Rates", navigation: "/hotels/summer" },
      { title: "Winter Rates", navigation: "/hotels/winter" },
    ],
  },
  {
    title: "Contacts",
    navigation: "/contacts",
    subLinks: [
      { title: "Clients", navigation: "contacts/clients" },
      { title: "Travel Agents", navigation: "contacts/travel-agents" },
    ],
  },
  {
    title: "Inventory",
    navigation: "/inventory",
    subLinks: [
      { title: "Add New Item", navigation: "/inventory/new-item" },
      { title: "Item Categories", navigation: "/inventory/item-categories" },
    ],
  },
  {
    title: "Staff",
    navigation: "/staff",
    subLinks: [
      { title: "Add New Staff", navigation: "/staff/new-member" },
      { title: "User Management", navigation: "users" },
      { title: "Roles & Permissions", navigation: "/users/roles-permissions" },
    ],
  },
  {
    title: "Settings",
    navigation: "/settings",
    subLinks: [
      { title: "My Profile", navigation: "/settings/profile" },
      { title: "Backup", navigation: "settings/backup" },
    ],
  },
  {
    title: "Logout",
    navigation: "#",
  },
];
