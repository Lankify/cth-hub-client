import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { InputField, DropdownField, DatePickerField, Button, useToast } from "../../components";
import { IoIosSave } from "react-icons/io";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const AddStaffMember: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    joinedDate: null as Date | null,
    resignedDate: null as Date | null,
    status: "Current",
    note: "",
    profileImageUrl: "",
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
      let profileImageUrl = "";

      if (selectedImage) {
        const cloudName = "lankify";
        const uploadPreset = "unsigned_preset";

        const imgData = new FormData();
        imgData.append("file", selectedImage);
        imgData.append("upload_preset", uploadPreset);
        imgData.append("folder", "staff");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: imgData,
        });

        const data = await res.json();
        profileImageUrl = data.secure_url;
      }

      const finalFormData = {
        ...formData,
        profileImageUrl,
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/staff/create`, finalFormData);
      showToast("Staff member created successfully", "success");
      navigate("/staff");
    } catch (err: any) {
      console.error("Create staff error:", err);
      showToast(err.response?.data?.message || "Failed to create staff member", "error");
    }
  };

  return (
    <div className="text-primary-txt">
      <h2 className="mb-1 text-3xl font-semibold">Add New Member</h2>
      <p className="text-secondary-txt mb-5">Fill out the details to register a new staff member</p>

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
            name="staffId"
            label="Employee ID"
            value={formData.staffId}
            onChange={handleChange}
            placeholder="e.g., CTH001"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g., Enuka"
              required
            />
            <InputField
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g., Pinsara"
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., enuka@ceylontp.com"
            required
          />
          <InputField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., 0702228887"
            numberOnly
            required
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="designation"
              label="Designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              required
            />
            <DropdownField
              name="department"
              label="Department"
              placeholder="Select Department"
              value={formData.department}
              onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
              options={[
                { label: "Management/CEO/COO", value: "Management" },
                { label: "Sales", value: "Sales" },
                { label: "Marketing", value: "Marketing" },
                { label: "Operations", value: "Operations" },
                { label: "Finance", value: "Finance" },
                { label: "Human Resources (HR)", value: "HR" },
                { label: "IT/Technology", value: "IT" },
              ]}
              required
            />
          </div>
          <DatePickerField
            label="Joined Date"
            value={formData.joinedDate}
            onChange={newDate => setFormData(prev => ({ ...prev, joinedDate: newDate }))}
            required
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
          <Button onClick={() => navigate("/staff")} variant="secondary">
            Go Back
          </Button>

          <Button startIcon={<IoIosSave />} type="submit">
            Save Member
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffMember;
