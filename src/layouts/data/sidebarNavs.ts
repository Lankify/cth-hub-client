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
    title: "Clients",
    navigation: "/clients",
    subLinks: [
      { title: "Active Clients", navigation: "/clients/active" },
      { title: "New Clients", navigation: "/clients/new" },
    ],
  },
  {
    title: "Inventory",
    navigation: "/inventory",
    subLinks: [{ title: "Add New Item", navigation: "/inventory/new-item" }],
  },
];
