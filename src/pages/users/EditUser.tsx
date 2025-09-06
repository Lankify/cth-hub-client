import React, { useState, useRef } from "react";
import type { IUser, IUserRole } from "../../types";
import { DropdownField, InputField } from "../../components";
import { FaImage, FaEye, FaEyeSlash } from "react-icons/fa";
import { Switch, Button } from "@mui/material";

interface Props {
  data: IUser;
  onChange: (updated: IUser) => void;
  roleOptions: IUserRole[];
}

const EditUser: React.FC<Props> = ({ data, onChange, roleOptions }) => {
  const backgroundColor = "var(--color-secondary)";
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="text-primary-txt space-y-6 py-4">
      <div className="flex flex-col items-center gap-3">
        {data.staff && typeof data.staff !== "string" && (
          <>
            {data.staff.profileImageUrl ? (
              <img
                src={data.staff.profileImageUrl}
                alt="Profile"
                className="border-secondary h-40 w-40 rounded-md border object-cover"
              />
            ) : (
              <div className="bg-secondary flex h-40 w-40 flex-col items-center justify-center rounded-md object-contain text-sm text-gray-400 dark:bg-gray-800">
                <FaImage className="mb-1 text-6xl" />
                No Profile Image
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-semibold">{`${data.staff.firstName} ${data.staff.lastName}`}</p>
              <p className="text-secondary-txt text-sm">{data.staff.staffId}</p>
            </div>
          </>
        )}
      </div>

      <DropdownField
        name="role"
        label="Role"
        value={data.role?._id || ""}
        onChange={e => {
          const selectedRole = roleOptions.find(r => r._id === e.target.value);
          if (selectedRole) {
            onChange({ ...data, role: selectedRole });
          }
        }}
        options={roleOptions.map(r => ({ label: r.name, value: r._id }))}
        placeholder="Select Role"
        backgroundColor={backgroundColor}
        required
        disabled={!data.isActive}
      />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <InputField
          name="username"
          label="Username"
          value={data.username}
          onChange={handleInput}
          backgroundColor={backgroundColor}
          required
          disabled={!data.isActive}
        />

        <div className={`flex ${data.isActive ? "gap-2" : ""} items-center`}>
          <div className="relative flex-1">
            <InputField
              ref={passwordRef}
              name="password"
              label="Password"
              type={isResettingPassword ? (showPassword ? "text" : "password") : "text"}
              value={isResettingPassword ? data.password || "" : showPassword ? "Hidden for security" : "••••••••••••"}
              onChange={handleInput}
              backgroundColor={backgroundColor}
              required
              disabled={!data.isActive}
            />

            {isResettingPassword && data.isActive && (
              <button
                type="button"
                className="text-secondary-txt absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>

          {data.isActive && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setIsResettingPassword(true);
                setShowPassword(true);
                onChange({ ...data, password: "" });

                setTimeout(() => {
                  passwordRef.current?.focus();
                }, 0);
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-500">Toggle the user account status.</p>

        <div className="flex items-center gap-3">
          <Switch
            checked={data.isActive}
            onChange={e => onChange({ ...data, isActive: e.target.checked })}
            color="primary"
          />
          <span className="text-sm font-medium">{data.isActive ? "Active" : "Inactive"}</span>{" "}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
