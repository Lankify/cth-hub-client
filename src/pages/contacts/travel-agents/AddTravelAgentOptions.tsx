import { Button } from "../../../components";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
  onSingle: () => void;
  onBulk: () => void;
}

const AddTravelAgentOptions: React.FC<Props> = ({ onSingle, onBulk }) => {
  return (
    <div className="text-primary-txt space-y-8 py-4 text-center">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-semibold">~ Add Travel Agent ~</h2>
        <p className="text-secondary-txt text-md mt-2">
          Select the method you prefer to create new travel agent records
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
        {/* Individual */}
        <div className="bg-secondary w-full max-w-sm rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
          <PersonAddIcon className="text-primary-txt mx-auto mb-3 h-10 w-10" />
          <h3 className="text-lg font-semibold">Individual Record</h3>
          <p className="text-secondary-txt mt-1 mb-6 text-sm">Add single record manually by filling in details.</p>
          <Button onClick={onSingle} className="w-full">
            Add Manually
          </Button>
        </div>

        {/* Bulk */}
        <div className="bg-secondary w-full max-w-sm rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
          <UploadFileIcon className="text-primary-txt mx-auto mb-3 h-10 w-10" />
          <h3 className="text-lg font-semibold">Bulk Upload</h3>
          <p className="text-secondary-txt mt-1 mb-6 text-sm">
            Upload multiple records at once using a CSV or Excel file.
          </p>
          <Button onClick={onBulk} variant="secondary" className="w-full">
            Upload File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTravelAgentOptions;
