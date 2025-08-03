import React, { useState, forwardRef, useImperativeHandle } from "react";
import { InputField, useToast } from "../../../components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

export interface AddItemCategoryRef {
  handleSubmit: () => void;
}

interface Props {
  onSuccess: () => void;
  setLoading?: (val: boolean) => void;
}

const AddItemCategory = forwardRef<AddItemCategoryRef, Props>(({ onSuccess }, ref) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    categoryId: "",
    category: "",
    note: "",
    imageUrl: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const backgroundColor = "var(--color-secondary)";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async (): Promise<string> => {
    const cloudName = "lankify";
    const uploadPreset = "unsigned_preset";

    const imgData = new FormData();
    imgData.append("file", selectedImage!);
    imgData.append("upload_preset", uploadPreset);
    imgData.append("folder", "inventory/item-categories");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: imgData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!formData.categoryId.trim() || !formData.category.trim()) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    try {
      let imageUrl = "";
      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary();
      }

      const finalData = {
        ...formData,
        imageUrl,
      };

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory/create-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      showToast("Category created successfully", "success");
      onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Failed to create category", "error");
    } finally {
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="text-primary-txt flex flex-col gap-4 py-2">
      <div className="flex justify-center">
        <div className="border-secondary bg-secondary hover:bg-secondary/80 relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="h-full w-full rounded-md object-contain" />
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedImage(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-1 right-1 rounded-sm bg-black/60 p-1 text-white hover:bg-red-600"
              >
                <CloseIcon fontSize="small" />
              </button>
            </>
          ) : (
            <label htmlFor="upload-image" className="text-primary-txt flex cursor-pointer flex-col items-center">
              <CloudUploadIcon className="mb-1" />
              <span className="text-center text-sm font-semibold">Click or drag & drop image here</span>
            </label>
          )}
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleImageChange(file);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="categoryId"
          label="Category ID"
          value={formData.categoryId}
          onChange={handleChange}
          placeholder="e.g., C001"
          backgroundColor={backgroundColor}
          required
        />
        <InputField
          name="category"
          label="Category Name"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Laptop"
          backgroundColor={backgroundColor}
          required
        />
      </div>
      <InputField
        name="note"
        label="Description"
        value={formData.note}
        onChange={handleChange}
        multiline
        rows={3}
        backgroundColor={backgroundColor}
      />
    </div>
  );
});

export default AddItemCategory;
