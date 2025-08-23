import type { IStaff } from "../../types";
import { FaImage } from "react-icons/fa";

interface Props {
  data: IStaff;
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

const getStatusStyle = (status?: string) => {
  switch (status) {
    case "Current":
      return { backgroundColor: "var(--color-primary-green)", color: "#fff" };
    case "Resigned":
      return { backgroundColor: "var(--color-primary-red)", color: "#fff" };
    default:
      return { backgroundColor: "transparent", color: "#ccc" };
  }
};

const calculateServicePeriod = (joinedDate?: string, resignedDate?: string) => {
  if (!joinedDate) return "-";

  const start = new Date(joinedDate);
  const end = resignedDate ? new Date(resignedDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);

  if (parts.length > 1) {
    const last = parts.pop();
    return parts.join(", ") + " & " + last;
  }

  return parts[0];
};

const ViewStaffDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-center">
        {data.profileImageUrl ? (
          <img src={data.profileImageUrl} alt="Item" className="h-40 w-40 rounded-md object-contain" />
        ) : (
          <div className="bg-secondary flex h-40 w-40 flex-col items-center justify-center rounded-md object-contain text-sm text-gray-400 dark:bg-gray-800">
            <FaImage className="mb-1 text-6xl" />
            No image selected
          </div>
        )}
      </div>

      <div className={`${subContainerStyle} bg-tertiary text-center`}>
        <div>
          <div className={labelStyle}>~ SERVICE PERIOD ~</div>
          <div className={valueStyle}>{calculateServicePeriod(data.joinedDate, data.resignedDate)}</div>
        </div>
      </div>

      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}># Employee ID</div>
            <div className={valueStyle}>{data.staffId || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Name</div>
            <div className={valueStyle}>{`${data.firstName || ""} ${data.lastName || ""}`.trim() || "-"}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Email</div>
            <div className={valueStyle}>{data.email || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Phone</div>
            <div className={valueStyle}>{data.phone || "-"}</div>
          </div>
        </div>
      </div>

      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Designation</div>
            <div className={valueStyle}>{data.designation || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Department</div>
            <div className={valueStyle}>{data.department || "-"}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className={labelStyle}>Status</div>
          <div className="mt-1 inline-block w-fit rounded-xs px-2 py-1 text-sm" style={getStatusStyle(data.status)}>
            {data.status || "-"}
          </div>
        </div>
      </div>

      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Joined Date</div>
            <div className={valueStyle}>{formatDate(data.joinedDate)}</div>
          </div>
          <div>
            <div className={labelStyle}>Resigned Date</div>
            <div className={valueStyle}>{formatDate(data.resignedDate)}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className={labelStyle}>Additional Note</div>
          <div className={valueStyle}>{data.note || "-"}</div>
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

export default ViewStaffDetails;
