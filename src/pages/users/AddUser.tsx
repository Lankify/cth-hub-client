import React, { useState, forwardRef, useImperativeHandle } from "react";
import { InputField, DropdownField, useToast } from "../../components";

export interface AddUserRef {
  handleSubmit: () => void;
}

interface Props {
  onSuccess: () => void;
  setLoading?: (val: boolean) => void;
  staffOptions: { _id: string; staffId: string; name: string; profileImageUrl?: string }[];
  roleOptions: { _id: string; name: string }[];
}

const subContainerStyle = "rounded-sm px-6 pb-6 pt-4 bg-secondary";
const labelStyle = "font-semibold text-sm text-secondary-txt mb-4";

const AddUser = forwardRef<AddUserRef, Props>(({ onSuccess, staffOptions, roleOptions }, ref) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    staffId: "",
    staffObjectId: "", // <-- NEW
    staffName: "",
    username: "",
    password: "",
    role: "",
    profileImageUrl: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const backgroundColor = "var(--color-primary)";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;

    if (name === "staffId") {
      const selectedStaff = staffOptions.find(s => s.staffId === value);
      if (selectedStaff) {
        setFormData(prev => ({
          ...prev,
          staffId: selectedStaff.staffId,
          staffObjectId: selectedStaff._id, // ✅ save Mongo _id here
          staffName: selectedStaff._id, // for dropdown sync
          profileImageUrl: selectedStaff.profileImageUrl || "",
          username: selectedStaff.name.split(" ")[0].toLowerCase(),
        }));
        setPreviewUrl(selectedStaff.profileImageUrl || null);
      }
    } else if (name === "staffName") {
      const selectedStaff = staffOptions.find(s => s._id === value);
      if (selectedStaff) {
        setFormData(prev => ({
          ...prev,
          staffId: selectedStaff.staffId,
          staffObjectId: selectedStaff._id, // ✅ store ObjectId
          staffName: selectedStaff._id,
          profileImageUrl: selectedStaff.profileImageUrl || "",
          username: selectedStaff.name.split(" ")[0].toLowerCase(),
        }));
        setPreviewUrl(selectedStaff.profileImageUrl || null);
      }
    } else {
      // ✅ this was missing
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.staffId || !formData.username || !formData.password || !formData.role) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    try {
      const finalData = {
        staff: formData.staffObjectId, // ✅ send Mongo ObjectId
        username: formData.username,
        password: formData.password,
        role: formData.role,
        profileImageUrl: formData.profileImageUrl,
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await res.json();

      if (res.ok) {
        showToast("User created successfully", "success");
        onSuccess();
      } else {
        showToast(result.message || "Failed to create user", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to create user", "error");
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="text-primary-txt flex flex-col gap-4 py-2">
      {/* Image Upload */}
      <div className="flex justify-center">
        <div className="border-secondary bg-secondary hover:bg-secondary/80 relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors">
          {previewUrl ? (
            <img src={previewUrl} alt="Staff Profile" className="h-full w-full rounded-md object-contain" />
          ) : (
            <span className="text-secondary-txt text-sm">Select a staff to see profile</span>
          )}
        </div>
      </div>

      <div className={subContainerStyle}>
        <p className={labelStyle}>Select the Staff Member by Employee ID or Employee Name</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DropdownField
            name="staffId"
            label="Employee ID"
            value={formData.staffId}
            onChange={handleChange}
            options={staffOptions.map(s => ({
              label: s.staffId,
              value: s.staffId,
            }))}
            placeholder="Select the ID"
            backgroundColor={backgroundColor}
            required
          />

          <DropdownField
            name="staffName"
            label="Employee Name"
            value={formData.staffName} // now holds _id
            onChange={handleChange}
            options={staffOptions.map(s => ({ label: s.name, value: s._id }))} // value = _id
            placeholder="Select the Member"
            backgroundColor={backgroundColor}
            required
          />
        </div>
      </div>

      <div className={subContainerStyle}>
        <p className={labelStyle}>Select the Role and Enter the Credentials</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            backgroundColor={backgroundColor}
            required
          />
          <InputField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            backgroundColor={backgroundColor}
            required
          />
          <DropdownField
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions.map(r => ({ label: r.name, value: r._id }))}
            placeholder="Select a Role"
            backgroundColor={backgroundColor}
            required
          />
        </div>
      </div>
    </div>
  );
});

export default AddUser;
