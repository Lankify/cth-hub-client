import React, { useState } from "react";
import type { IItemCategory } from "../../../types";
import { InputField } from "../../../components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  data: IItemCategory;
  onChange: (updated: IItemCategory) => void;
}

const EditItemCategory: React.FC<Props> = ({ data, onChange }) => {
  const backgroundColor = "var(--color-secondary)";
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.imageUrl || null);

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
    formData.append("folder", "inventory/item-categories");

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
          name="categoryId"
          label="Category ID"
          value={data.categoryId}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
        <InputField
          name="category"
          label="Category"
          value={data.category}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <InputField
            name="note"
            label="Description"
            multiline
            rows={3}
            value={data.note ?? ""}
            onChange={handleInput}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    </div>
  );
};

export default EditItemCategory;
