import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputField, Button } from "../../../components";
import { IoIosSave } from "react-icons/io";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const mainContainerStyle = "p-8 bg-primary rounded-md shadow-sm";
const subContainerStyle = "grid grid-cols-1 gap-4 md:grid-cols-2";
const sectionHeadingStyle = "mb-8 text-md font-semibold text-primary-txt uppercase";
const backgroundColor = "var(--color-secondary)";

const AddSingleTravelAgent: React.FC = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    ownerName: "",
    designation: "",
    email: "",
    phone: "",
    alternatePhone: "",
    website: "",
    facebook: "",
    instagram: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    description: "",
    status: "Active",
    logoUrl: "",
  });

  const navigate = useNavigate();

  const handleLogoChange = (file: File) => {
    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let logoUrl = "";

      if (logoFile) {
        const cloudName = "lankify";
        const uploadPreset = "unsigned_preset";
        const formDataImg = new FormData();
        formDataImg.append("file", logoFile);
        formDataImg.append("upload_preset", uploadPreset);
        formDataImg.append("folder", "contacts/travel-agents");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formDataImg,
        });
        const data = await res.json();
        logoUrl = data.secure_url;
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/travel-agents/create`, {
        ...formData,
        logoUrl,
      });

      navigate("/contacts/travel-agents");
    } catch (err) {
      console.error(err);
      alert("Failed to create travel agent");
    }
  };

  return (
    <div className="text-primary-txt">
      <h2 className="mb-1 text-3xl font-semibold">Add New Travel Agent</h2>
      <p className="text-secondary-txt mb-5">Fill out the details to create a new travel agent record</p>

      <form
        onSubmit={handleSubmit}
        className="bg-secondary bg-opacity-90 grid grid-cols-1 gap-5 rounded-sm px-6 py-4 shadow-md"
      >
        <div className="flex justify-center">
          <div className="border-primary bg-primary hover:bg-primary/80 relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors">
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Logo Preview" className="h-full w-full rounded-md object-contain" />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setLogoFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-1 right-1 rounded-sm bg-black/60 p-1 text-white transition hover:bg-red-600"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </>
            ) : (
              <label
                htmlFor="logo-upload"
                className="text-primary-txt absolute inset-0 flex cursor-pointer flex-col items-center justify-center"
              >
                <CloudUploadIcon className="mb-1" />
                <span className="px-2 text-center font-semibold select-none">Click or drag & drop logo</span>
              </label>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleLogoChange(file);
                e.target.value = "";
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className={mainContainerStyle}>
          <h3 className={sectionHeadingStyle}>Basic Information</h3>
          <div className={subContainerStyle}>
            <InputField
              name="name"
              label="Travel Agent Name"
              value={formData.name}
              onChange={handleChange}
              required
              backgroundColor={backgroundColor}
            />
            <InputField
              name="registrationNumber"
              label="Registration Number"
              value={formData.registrationNumber}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <div className="col-span-2">
              <InputField
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                backgroundColor={backgroundColor}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={mainContainerStyle}>
          <h3 className={sectionHeadingStyle}>Contact Information</h3>
          <div className={subContainerStyle}>
            <InputField
              name="email"
              label="Email"
              value={formData.email}
              backgroundColor={backgroundColor}
              onChange={handleChange}
              required
            />
            <InputField
              name="phone"
              label="Phone"
              value={formData.phone}
              backgroundColor={backgroundColor}
              onChange={handleChange}
              required
            />
            <InputField
              name="alternatePhone"
              label="Alternate Phone"
              value={formData.alternatePhone}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Representative Details */}
        <div className={mainContainerStyle}>
          <h3 className={sectionHeadingStyle}>Other Details</h3>
          <div className={subContainerStyle}>
            <InputField
              name="ownerName"
              label="Contact Person"
              value={formData.ownerName}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <InputField
              name="designation"
              label="Designation"
              value={formData.designation}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <InputField
              name="website"
              label="Website URL"
              value={formData.website}
              backgroundColor={backgroundColor}
              className="md:col-span-2"
              onChange={handleChange}
            />
            <InputField
              name="facebook"
              label="Facebook URL"
              value={formData.facebook}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <InputField
              name="instagram"
              label="Instagram URL"
              value={formData.instagram}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Address */}
        <div className={mainContainerStyle}>
          <h3 className={sectionHeadingStyle}>Location Details</h3>
          <div className={subContainerStyle}>
            <InputField
              name="address"
              label="Address"
              value={formData.address}
              backgroundColor={backgroundColor}
              className="md:col-span-2"
              onChange={handleChange}
            />
            <InputField
              name="city"
              label="City"
              value={formData.city}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <InputField
              name="province"
              label="Province"
              value={formData.province}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <InputField
              name="postalCode"
              label="Postal Code"
              value={formData.postalCode}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
            <InputField
              name="country"
              label="Country"
              value={formData.country}
              backgroundColor={backgroundColor}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button onClick={() => navigate("/contacts/travel-agents")} variant="secondary">
            Go Back
          </Button>

          <Button startIcon={<IoIosSave />} type="submit">
            Save Record
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSingleTravelAgent;
