import React, { useState } from "react";
import type { ITravelAgent } from "../../../types";
import { InputField } from "../../../components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  data: ITravelAgent;
  onChange: (updated: ITravelAgent) => void;
}

const EditTravelAgent: React.FC<Props> = ({ data, onChange }) => {
  const backgroundColor = "var(--color-primary)";
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.logoUrl || null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleImageChange = async (file: File) => {
    const cloudName = "lankify";
    const uploadPreset = "unsigned_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "contacts/travel-agents");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const dataRes = await res.json();
      if (dataRes.secure_url) {
        setPreviewUrl(dataRes.secure_url);
        onChange({ ...data, logoUrl: dataRes.secure_url });
      } else {
        console.error("Cloudinary upload failed", dataRes);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onChange({ ...data, logoUrl: "" });
  };

  return (
    <div className="text-primary-txt space-y-6 py-4">
      {/* Logo Upload */}
      <div className="flex justify-center">
        <div className="border-secondary bg-secondary hover:bg-secondary/80 relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Logo Preview" className="h-full w-full rounded-md object-contain" />
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-1 right-1 rounded-sm bg-black/60 p-1 text-white hover:bg-red-600"
              >
                <CloseIcon fontSize="small" />
              </button>
            </>
          ) : (
            <label
              htmlFor="agent-logo-upload"
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-center"
            >
              <CloudUploadIcon className="mb-1 text-3xl" />
              <span className="text-sm font-semibold select-none">Click or drag & drop logo</span>
            </label>
          )}
          <input
            id="agent-logo-upload"
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

      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          name="name"
          label="Travel Agent Name"
          value={data.name || ""}
          onChange={handleInput}
          backgroundColor="var(--color-secondary)"
          required
        />
        <InputField
          name="registrationNumber"
          label="Registration Number"
          value={data.registrationNumber || ""}
          onChange={handleInput}
          backgroundColor="var(--color-secondary)"
        />
        <div className="col-span-2">
          {/* Description */}
          <InputField
            name="description"
            label="Description"
            multiline
            rows={3}
            value={data.description || ""}
            onChange={handleInput}
            backgroundColor="var(--color-secondary)"
          />
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-secondary rounded-sm px-6 py-4">
        <h3 className="text-primary-blue mb-6 text-sm font-semibold">~ CONTACT INFO ~</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="email"
            label="Email"
            value={data.email || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
            required
          />
          <InputField
            name="phone"
            label="Phone"
            value={data.phone || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
            required
          />
          <InputField
            name="alternatePhone"
            label="Alternate Phone"
            value={data.alternatePhone || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>

      {/* Owner / Designation / Website / Social */}
      <div className="bg-secondary rounded-sm px-6 py-4">
        <h3 className="text-primary-blue mb-6 text-sm font-semibold">~ OTHER DETAILS ~</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="ownerName"
            label="Contact Person"
            value={data.ownerName || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
          <InputField
            name="designation"
            label="Designation"
            value={data.designation || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
          <InputField
            name="website"
            label="Website"
            value={data.website || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
            className="md:col-span-2"
          />
          <InputField
            name="facebook"
            label="Facebook"
            value={data.facebook || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
          <InputField
            name="instagram"
            label="Instagram"
            value={data.instagram || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-secondary rounded-sm px-6 py-4">
        <h3 className="text-primary-blue mb-6 text-sm font-semibold">~ LOCATION DETAILS ~</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="address"
            label="Address"
            value={data.address || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
            className="md:col-span-2"
          />
          <InputField
            name="city"
            label="City"
            value={data.city || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
          <InputField
            name="province"
            label="Province"
            value={data.province || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
          <InputField
            name="postalCode"
            label="Postal Code"
            value={data.postalCode || ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
          <InputField
            name="country"
            label="Country"
            value={data.country || "Sri Lanka"}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTravelAgent;
