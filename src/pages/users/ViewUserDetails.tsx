import { useState } from "react";
import type { IUser } from "../../types";
import { FaImage, FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
  data: IUser;
}

const labelStyle = "font-semibold text-sm text-primary-txt";
const valueStyle = "text-base text-secondary-txt";
const mainContainerStyle = "grid grid-cols-1 gap-4 rounded-sm px-6 py-4 md:grid-cols-2 bg-secondary";
const subContainerStyle = "rounded-sm px-6 py-4 bg-secondary";

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getActiveStatusStyle = (isActive?: boolean) => {
  if (isActive) {
    return { backgroundColor: "var(--color-primary-green)", color: "#fff" };
  } else if (isActive === false) {
    return { backgroundColor: "var(--color-primary-red)", color: "#fff" };
  } else {
    return { backgroundColor: "transparent", color: "#ccc" };
  }
};

const ViewUserDetails: React.FC<Props> = ({ data }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-center">
        {typeof data.staff !== "string" ? (
          data.staff?.profileImageUrl ? (
            <img src={data.staff?.profileImageUrl} alt="Item" className="h-40 w-40 rounded-md object-cover" />
          ) : (
            <div className="bg-secondary flex h-40 w-40 flex-col items-center justify-center rounded-md object-contain text-sm text-gray-400 dark:bg-gray-800">
              <FaImage className="mb-1 text-6xl" />
              No image selected
            </div>
          )
        ) : null}
      </div>

      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Employee ID</div>
            <div className={valueStyle}> {typeof data.staff !== "string" ? data.staff?.staffId || "-" : "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Name</div>
            <div className={valueStyle}>
              {typeof data.staff !== "string"
                ? `${data.staff?.firstName || ""} ${data.staff?.lastName || ""}`.trim() || "-"
                : "-"}
            </div>
          </div>
        </div>
      </div>

      <div className={`${subContainerStyle} bg-tertiary`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Username</div>
            <div className={valueStyle}>{data.username || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Password</div>
            <div className="flex items-center gap-2">
              <span className={valueStyle}> {showPassword ? "Hidden for security" : "•••••••••••••"}</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral bg-primary rounded-sm p-1.5 hover:opacity-75"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Role</div>
            <div className={valueStyle}>{data.role?.name || "-"}</div>
          </div>

          <div>
            <div className={labelStyle}>Status</div>
            <div
              className="mt-1 inline-block w-fit rounded-xs px-2 py-0.5 text-sm"
              style={getActiveStatusStyle(data.isActive)}
            >
              {data.isActive ? "Active" : "Deactive"}
            </div>
          </div>
        </div>
      </div>

      <div className={`${mainContainerStyle} bg-tertiary`}>
        <div>
          <div className={labelStyle}>Created :</div>
          <div className={valueStyle}>{formatDate(data.createdAt)}</div>
        </div>
        <div>
          <div className={labelStyle}>Updated :</div>
          <div className={valueStyle}>{formatDate(data.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;
