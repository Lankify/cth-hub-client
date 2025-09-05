import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useInventoryCategories } from "../../../hooks";
import { InputField, DropdownField, DatePickerField, Button, useToast } from "../../../components";
import { IoIosSave } from "react-icons/io";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const AddInventory: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { inventoryCategories, loading, error } = useInventoryCategories();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: null as Date | null,
    warrantyExpiryDate: null as Date | null,
    status: "Available",
    note: "",
    imageUrl: "",
  });

  const handleImageChange = (file: File) => {
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (selectedImage) {
        const cloudName = "lankify";
        const uploadPreset = "unsigned_preset";

        const imgData = new FormData();
        imgData.append("file", selectedImage);
        imgData.append("upload_preset", uploadPreset);
        imgData.append("folder", "inventory/items");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: imgData,
        });

        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const finalFormData = {
        ...formData,
        imageUrl,
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/inventory/create`, finalFormData);
      showToast("Item created successfully", "success");
      navigate("/inventory");
    } catch (err: any) {
      console.error("Create item error:", err);
      showToast(err.response?.data?.message || "Failed to create item", "error");
    }
  };

  return (
    <div className="text-primary-txt">
      <h2 className="mb-1 text-3xl font-semibold">Add New Item</h2>
      <p className="text-secondary-txt mb-5">Fill out the details to register a new inventory item</p>

      <form
        onSubmit={handleSubmit}
        className="bg-secondary bg-opacity-90 grid grid-cols-1 gap-5 rounded-sm px-6 py-4 shadow-md"
      >
        {/* Row 1 */}
        <div className="flex justify-center">
          <div className="border-primary bg-primary hover:bg-primary/80 relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors">
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
                  className="absolute top-1 right-1 rounded-sm bg-black/60 p-1 text-white transition hover:bg-red-600"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </>
            ) : (
              <label
                htmlFor="image-upload-input"
                className="text-primary-txt absolute inset-0 flex cursor-pointer flex-col items-center justify-center"
              >
                <CloudUploadIcon className="mb-1" />
                <span className="px-2 text-center font-semibold select-none">Click or drag & drop image here</span>
              </label>
            )}
            <input
              id="image-upload-input"
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

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="name"
            label="Item Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Lenovo V15 G4 IRU"
            required
          />
          <DropdownField
            name="category"
            label="Category"
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder={loading ? "Loading categories..." : "Select Category"}
            options={inventoryCategories
              .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateA - dateB;
              })
              .map(i => ({ label: i.category, value: i.category }))}
            required
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="serialNumber"
            label="Serial Number"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="e.g., PF4VER5Q"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="brand"
              label="Brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Lenovo"
              required
            />
            <InputField
              name="model"
              label="Model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., 83A1"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DatePickerField
            label="Purchase Date"
            value={formData.purchaseDate}
            onChange={newDate => setFormData(prev => ({ ...prev, purchaseDate: newDate }))}
          />

          <DatePickerField
            label="Warranty Expiry Date"
            value={formData.warrantyExpiryDate}
            onChange={newDate => setFormData(prev => ({ ...prev, warrantyExpiryDate: newDate }))}
          />
        </div>

        {/* Row 5 */}
        <InputField
          name="note"
          label="Note (optional)"
          multiline
          rows={3}
          value={formData.note}
          onChange={handleChange}
        />

        {/* Row 6 */}
        <div className="flex justify-end gap-2">
          <Button onClick={() => navigate("/inventory")} variant="secondary">
            Go Back
          </Button>

          <Button startIcon={<IoIosSave />} type="submit">
            Save Item
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;
