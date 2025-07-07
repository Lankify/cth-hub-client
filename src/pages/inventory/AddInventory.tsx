import React from "react";

const AddInventory: React.FC = () => {
  return (
    <div className="text-primary-txt">
      <h2 className="mb-1 text-3xl font-semibold">Add New Item</h2>
      <p className="mb-6 text-secondary-txt">Fill out the details to register a new inventory item</p>

      <form className="grid grid-cols-1 gap-6 p-6 rounded-lg shadow-lg bg-secondary bg-opacity-90 md:grid-cols-2">
        {/* Item Name */}
        <div>
          <label className="block mb-1 text-sm">Item Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary"
            placeholder="e.g., Dell Laptop"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <select className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary">
            <option>Laptop</option>
            <option>Desktop</option>
            <option>Camera</option>
            <option>Mobile Phone</option>
            <option>Other</option>
          </select>
        </div>

        {/* Serial Number */}
        <div>
          <label className="block mb-1 text-sm">Serial Number</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary"
            placeholder="e.g., SN-12345XYZ"
          />
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block mb-1 text-sm">Purchase Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 text-sm">Status</label>
          <select className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary">
            <option>Available</option>
            <option>In Use</option>
            <option>Under Repair</option>
            <option>Disposed</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 text-sm">Location</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary"
            placeholder="e.g., Colombo HQ"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">Notes</label>
          <textarea
            rows={3}
            className="w-full px-4 py-2 border rounded bg-primary text-primary-txt border-border-secondary"
            placeholder="Optional details..."
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-end md:col-span-2">
          <button type="submit" className="px-6 py-2 text-white transition-all rounded bg-neutral hover:bg-opacity-90">
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;
