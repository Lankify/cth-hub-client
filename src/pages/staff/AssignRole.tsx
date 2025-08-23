import type { IStaff, IUser } from "../../types";
import { InputField, DropdownField } from "../../components";
import { useUserRoles } from "../..//hooks/useUserRoles";
import { FaImage } from "react-icons/fa";

interface Props {
  staff: IStaff;
  user: IUser;
  onChange: (updated: IUser) => void;
}

const AssignRole: React.FC<Props> = ({ staff, user, onChange }) => {
  const { roles, loading, error } = useUserRoles();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...user, [name]: value });
  };

  const handleDropdown = (name: string, value: string) => {
    onChange({ ...user, [name]: value });
  };

  return (
    <div className="space-y-4 py-2">
      {/* Profile */}
      <div className="flex justify-center">
        {staff.profileImageUrl ? (
          <img src={staff.profileImageUrl} alt="Item" className="h-40 w-40 rounded-md object-contain" />
        ) : (
          <div className="bg-secondary flex h-40 w-40 flex-col items-center justify-center rounded-md text-sm text-gray-400 dark:bg-gray-800">
            <FaImage className="mb-1 text-6xl" />
            No image selected
          </div>
        )}
      </div>

      <div className="bg-tertiary rounded-sm px-6 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-primary-txt text-sm font-semibold">Employee ID</div>
            <div className="text-secondary-txt text-base">{staff.staffId || "-"}</div>
          </div>
          <div>
            <div className="text-primary-txt text-sm font-semibold">Name</div>
            <div className="text-secondary-txt text-base">
              {`${staff.firstName || ""} ${staff.lastName || ""}`.trim() || "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary rounded-sm px-6 py-6">
        <p className="text-secondary-txt mb-6 text-sm font-medium">
          Please fill in the details below to register a new user
        </p>
        <div className="mb-4">
          <DropdownField
            name="role"
            label="Role"
            value={user.role}
            options={
              roles.map(r => ({ label: r.name, value: r._id })) // 👈 dynamic options
            }
            onChange={e => handleDropdown("role", e.target.value)}
            required
            placeholder={loading ? "Loading roles..." : "Select a role"}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <InputField name="username" label="Username" value={user.username} onChange={handleInput} required />

          <div className="flex items-end gap-2">
            <InputField
              name="password"
              label="Password"
              type="password"
              value={user.password || ""}
              onChange={handleInput}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRole;
