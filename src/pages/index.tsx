export { default as Dashboard } from "./dashboard";

// export { default as Hotels } from "./hotels";

export { default as Contacts } from "./contacts";
export { default as TravelAgents } from "./contacts/travel-agents";
export { default as AddTravelAgentOptions } from "./contacts/travel-agents/AddTravelAgentOptions";
export { default as AddSingleTravelAgent } from "./contacts/travel-agents/AddSingleTravelAgent";
export { default as AddMultipleTravelAgents } from "./contacts/travel-agents/AddMultipleTravelAgents";



export { default as ViewTravelAgents } from "./contacts/travel-agents/ViewTravelAgent";
export { default as EditTravelAgent } from "./contacts/travel-agents/EditTravelAgent";

export { default as Inventory } from "./inventory/items";
export { default as AddInventory } from "./inventory/items/AddInventory";
export { default as ViewItemDetails } from "./inventory/items/ViewItemDetails";
export { default as EditInventory } from "./inventory/items/EditInventory";

export { default as ItemCategories } from "./inventory/item-categories";
export { default as AddItemCategory } from "./inventory/item-categories/AddItemCategory";
export type { AddItemCategoryRef } from "./inventory/item-categories/AddItemCategory";
export { default as ViewCategoryDetails } from "./inventory/item-categories/ViewCategoryDetails";
export { default as EditItemCategory } from "./inventory/item-categories/EditItemCategory";

export { default as Staff } from "./staff";
export { default as AddStaffMember } from "./staff/AddStaffMember";
export { default as ViewStaffMember } from "./staff/ViewStaffDetails";
export { default as EditStaffMember } from "./staff/EditStaffMember";
export { default as AssignRole } from "./staff/AssignRole";

export { default as Users } from "./users";
export { default as AddUser } from "./users/AddUser";
export type { AddUserRef } from "./users/AddUser";
export { default as ViewUserDetails } from "./users/ViewUserDetails";
export { default as EditUser } from "./users/EditUser";
