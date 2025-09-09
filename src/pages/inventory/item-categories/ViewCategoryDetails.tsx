import type { IItemCategory } from "../../../types";
import { FaImage } from "react-icons/fa";

interface Props {
  data: IItemCategory;
}

const labelStyle = "font-semibold text-sm text-primary-txt";
const valueStyle = "text-base text-secondary-txt";
const mainContainerStyle = "grid grid-cols-1 gap-4 rounded-sm px-6 py-4 md:grid-cols-2 bg-secondary";
const subContainerStyle = "rounded-sm px-6 py-4 bg-secondary";

const formatDate = (date?: string) => {
  return date ? new Date(date).toLocaleDateString("en-GB") : "-";
};

const ViewCategoryDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="py-2 space-y-4">
      <div className="flex justify-center">
        {data.imageUrl ? (
          <img src={data.imageUrl} alt="Item" className="object-contain w-40 h-40 rounded-md" />
        ) : (
          <div className="flex flex-col items-center justify-center object-contain w-40 h-40 text-sm text-gray-400 rounded-md bg-secondary dark:bg-gray-800">
            <FaImage className="mb-1 text-6xl" />
            No image selected
          </div>
        )}
      </div>

      <div className={subContainerStyle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelStyle}># ID</div>
            <div className={valueStyle}>{data.categoryId || "-"}</div>
          </div>
          <div>
            <div className={labelStyle}>Category</div>
            <div className={valueStyle}>{data.category || "-"}</div>
          </div>
        </div>
        <div className="mt-4">
          <div>
            <div className={labelStyle}>Description</div>
            <div className={valueStyle}>{data.note || "-"}</div>
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

export default ViewCategoryDetails;
