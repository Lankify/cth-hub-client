import type { IInventory } from "../../../types";
import { FaImage } from "react-icons/fa";

interface Props {
  data: IInventory;
}

const labelStyle = "font-semibold text-sm text-primary-txt";
const valueStyle = "text-base text-secondary-txt";
const mainContainerStyle = "grid grid-cols-1 gap-4 rounded-sm px-6 py-4 md:grid-cols-2 bg-secondary";
const subContainerStyle = "rounded-sm px-6 py-4 bg-secondary";

const formatDate = (date?: string) => {
  return date ? new Date(date).toLocaleDateString("en-GB") : "-";
};

const getStatusStyle = (status?: string) => {
  switch (status) {
    case "Available":
      return { backgroundColor: "var(--color-primary-green)", color: "#fff" };
    case "In Use":
      return { backgroundColor: "#e5ad06", color: "#fff" };
    case "Under Repair":
      return { backgroundColor: "var(--color-primary-red)", color: "#fff" };
    case "Disposed":
      return { backgroundColor: "#808080", color: "#fff" };
    default:
      return { backgroundColor: "transparent", color: "#ccc" };
  }
};

const ViewItemDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-center">
        {data.imageUrl ? (
          <img src={data.imageUrl} alt="Item" className="h-40 w-40 rounded-md object-contain" />
        ) : (
          <div className="bg-secondary flex h-40 w-40 flex-col items-center justify-center rounded-md object-contain text-sm text-gray-400 dark:bg-gray-800">
            <FaImage className="mb-1 text-6xl" />
            No image selected
          </div>
        )}
      </div>

      <div className={mainContainerStyle}>
        <div>
          <div className={labelStyle}>Name</div>
          <div className={valueStyle}>{data.name || "-"}</div>
        </div>
        <div>
          <div className={labelStyle}>Serial Number</div>
          <div className={valueStyle}>{data.serialNumber || "-"}</div>
        </div>
        <div>
          <div className={labelStyle}>Category</div>
          <div className={valueStyle}>{data.category || "-"}</div>
        </div>
        <div>
          <div className={labelStyle}>Brand / Model</div>
          <div className={valueStyle}>
            {data.brand || "-"} {data.model ? ` / ${data.model}` : ""}
          </div>
        </div>
        <div>
          <div className={labelStyle}>Purchase Date</div>
          <div className={valueStyle}>{formatDate(data.purchaseDate)}</div>
        </div>
        <div>
          <div className={labelStyle}>Warranty Expiry</div>
          <div className={valueStyle}>{formatDate(data.warrantExpiraryDate)}</div>
        </div>
      </div>

      <div className={subContainerStyle}>
        <div className={labelStyle}>Personal Note</div>
        <div className={valueStyle}>{data.note || "-"}</div>
      </div>

      <div className={subContainerStyle}>
        <div className="mb-4">
          <div className={labelStyle}>Status</div>
          <div className="mt-1 inline-block w-fit rounded-xs px-2 py-1 text-sm" style={getStatusStyle(data.status)}>
            {data.status || "-"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}>Assigned To</div>
            <div className={valueStyle}>{data.assignedTo || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Assigned Date</div>
            <div className={valueStyle}>{formatDate(data.assignedDate)}</div>
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

export default ViewItemDetails;
