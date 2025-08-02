import React, { useState } from "react";
import type { IInventory } from "../../types";
import { InputField, DatePickerField, DropdownField } from "../../components";
import type { SelectChangeEvent } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  data: IInventory;
  onChange: (updated: IInventory) => void;
}

const categoryOptions = [
  { label: "Laptop", value: "Laptop" },
  { label: "Desktop", value: "Desktop" },
  { label: "Mobile Phone", value: "Mobile Phone" },
  { label: "Camera", value: "Camera" },
  { label: "Other", value: "Other" },
];

const statusOptions = [
  { label: "Available", value: "Available" },
  { label: "In Use", value: "In Use" },
  { label: "Under Repair", value: "Under Repair" },
  { label: "Disposed", value: "Disposed" },
];

const EditInventory: React.FC<Props> = ({ data, onChange }) => {
  const backgroundColor = "var(--color-secondary)";
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.imageUrl || null);
  const isEditable = data.status === "In Use";

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleDropdownChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    if (name === "status") {
      if (value !== "In Use") {
        onChange({
          ...data,
          status: value,
          assignedTo: "",
          assignedDate: "",
        });
        return;
      }
    }

    onChange({ ...data, [name]: value });
  };

  const handleDateChange = (name: keyof IInventory, date: Date | null) => {
    onChange({ ...data, [name]: date });
  };

  const handleImageChange = async (file: File) => {
    const cloudName = "lankify";
    const uploadPreset = "unsigned_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "inventory");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const dataRes = await res.json();

      if (dataRes.secure_url) {
        setPreviewUrl(dataRes.secure_url);
        onChange({ ...data, imageUrl: dataRes.secure_url });
      } else {
        console.error("Cloudinary upload failed", dataRes);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onChange({ ...data, imageUrl: "" });
  };

  return (
    <div className="text-primary-txt space-y-6 py-4">
      {/* Image Upload Section */}
      <div className="flex justify-center">
        <div className="border-secondary bg-secondary hover:bg-secondary/80 relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="h-full w-full rounded-md object-contain" />
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-1 right-1 rounded-sm bg-black/60 p-1 text-white transition hover:bg-red-600"
              >
                <CloseIcon fontSize="small" />
              </button>
            </>
          ) : (
            <label
              htmlFor="edit-image-upload"
              className="text-primary-txt absolute inset-0 flex cursor-pointer flex-col items-center justify-center"
            >
              <CloudUploadIcon className="mb-1" />
              <span className="px-2 text-center font-semibold select-none">Click or drag & drop new image</span>
            </label>
          )}
          <input
            id="edit-image-upload"
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageChange(file);
                e.target.value = "";
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="name"
          label="Name"
          value={data.name}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
        <InputField
          name="serialNumber"
          label="Serial Number"
          value={data.serialNumber}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <DropdownField
            name="category"
            label="Category"
            value={data.category || ""}
            placeholder="Select Category"
            options={categoryOptions}
            onChange={handleDropdownChange}
            backgroundColor={backgroundColor}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="brand"
          label="Brand"
          value={data.brand}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
        <InputField
          name="model"
          label="Model"
          value={data.model ?? ""}
          onChange={handleInput}
          backgroundColor={backgroundColor}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePickerField
          label="Purchase Date"
          value={data.purchaseDate ? new Date(data.purchaseDate) : null}
          onChange={date => handleDateChange("purchaseDate", date)}
          backgroundColor={backgroundColor}
        />
        <DatePickerField
          label="Warranty Date"
          value={data.warrantExpiraryDate ? new Date(data.warrantExpiraryDate) : null}
          onChange={date => handleDateChange("warrantExpiraryDate", date)}
          backgroundColor={backgroundColor}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <DropdownField
            name="status"
            label="Status"
            value={data.status || ""}
            placeholder="Select Status"
            options={statusOptions}
            onChange={handleDropdownChange}
            backgroundColor={backgroundColor}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="assignedTo"
          label="Assigned To"
          value={data.assignedTo ?? ""}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          disabled={!isEditable}
          required
        />
        <DatePickerField
          label="Assigned Date"
          value={data.assignedDate ? new Date(data.assignedDate) : null}
          onChange={date => handleDateChange("assignedDate", date)}
          backgroundColor={backgroundColor}
          disabled={!isEditable}
        />
      </div>

      <InputField
        name="note"
        label="Note"
        multiline
        rows={3}
        value={data.note ?? ""}
        onChange={handleInput}
        backgroundColor={backgroundColor}
      />
    </div>
  );
};

export default EditInventory;
