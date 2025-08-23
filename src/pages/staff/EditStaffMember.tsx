import React, { useState } from "react";
import type { IStaff } from "../../types";
import { InputField, DatePickerField, DropdownField } from "../../components";
import type { SelectChangeEvent } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  data: IStaff;
  onChange: (updated: IStaff) => void;
}

const departmentOptions = [
  { label: "Management/CEO/COO", value: "Management" },
  { label: "Sales", value: "Sales" },
  { label: "Marketing", value: "Marketing" },
  { label: "Operations", value: "Operations" },
  { label: "Finance", value: "Finance" },
  { label: "Human Resources (HR)", value: "HR" },
  { label: "IT/Technology", value: "IT" },
];

const statusOptions = [
  { label: "Current", value: "Current" },
  { label: "Resigned", value: "Resigned" },
];

const EditStaffMember: React.FC<Props> = ({ data, onChange }) => {
  const backgroundColor = "var(--color-secondary)";
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.profileImageUrl || null);
  const isEditable = data.status === "Resigned";

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleDropdownChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    if (name === "status") {
      if (value == "Resigned") {
        onChange({
          ...data,
          status: value,
          resignedDate: "",
        });
        return;
      }
    }

    onChange({ ...data, [name]: value });
  };

  const handleDateChange = (name: keyof IStaff, date: Date | null) => {
    onChange({ ...data, [name]: date });
  };

  const handleImageChange = async (file: File) => {
    const cloudName = "lankify";
    const uploadPreset = "unsigned_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "staff");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const dataRes = await res.json();

      if (dataRes.secure_url) {
        setPreviewUrl(dataRes.secure_url);
        onChange({ ...data, profileImageUrl: dataRes.secure_url });
      } else {
        console.error("Cloudinary upload failed", dataRes);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onChange({ ...data, profileImageUrl: "" });
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
      <InputField
        name="staffId"
        label="Employee ID"
        value={data.staffId}
        onChange={handleInput}
        backgroundColor={backgroundColor}
        required
      />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <InputField
          name="firstName"
          label="First Name"
          value={data.firstName}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
        <InputField
          name="lastName"
          label="Last Name"
          value={data.lastName}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="email"
          label="Email"
          value={data.email}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
        <InputField
          name="phone"
          label="Phone"
          value={data.phone}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          numberOnly
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="designation"
          label="Designation"
          value={data.designation}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
        <DropdownField
          name="department"
          label="Department"
          value={data.department || ""}
          placeholder="Select Department"
          options={departmentOptions}
          onChange={handleDropdownChange}
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
        <DatePickerField
          label="Joined Date"
          value={data.joinedDate ? new Date(data.joinedDate) : null}
          onChange={date => handleDateChange("joinedDate", date)}
          backgroundColor={backgroundColor}
        />
        <DatePickerField
          label="Resigned Date"
          value={data.resignedDate ? new Date(data.resignedDate) : null}
          onChange={date => handleDateChange("resignedDate", date)}
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

export default EditStaffMember;
