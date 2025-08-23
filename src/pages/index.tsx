export { default as Dashboard } from "./dashboard";

export { default as HotelRates } from "./hotels/HotelRates";

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
