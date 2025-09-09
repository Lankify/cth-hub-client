import { useState } from "react";
import { Button } from "../../../components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { MdClear, MdSave } from "react-icons/md";
import * as XLSX from "xlsx";
import axios from "axios";

interface Props {
  onUpload?: (file: File, showToast: (msg: string, type: "success" | "error" | "warning") => void) => void;
  showToast: (msg: string, type: "success" | "error" | "warning") => void;
}

const AddMultipleTravelAgent: React.FC<Props> = ({ onUpload, showToast }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const mappedData = jsonData.map(row => ({
        name: row["Name"] || "",
        registrationNumber: row["Registration Number"] || "",
        description: row["Description"] || "",
        ownerName: row["Contact Person"] || "",
        designation: row["Designation"] || "",
        email: row["Email"] || "",
        phone: row["Mobile Number"] || "",
        alternatePhone: row["Other Number"] || "",
        address: row["Address"] || "",
        city: row["City"] || "",
        province: row["Province"] || "",
        country: row["Country"] || "",
        postalCode: row["Postal Code"] || "",
        website: row["Website"] || "",
        facebook: row["Facebook"] || "",
        instagram: row["Instagram"] || "",
        logoUrl: row["Logo"] || "",
      }));

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/travel-agents/bulk-create`, mappedData);

      // Handle duplicates or errors
      if (res.data.failedRecords && res.data.failedRecords.length > 0) {
        const duplicateMsg = res.data.failedRecords.map((r: any) => `${r.name} (${r.email || r.phone})`).join(", ");
        showToast(`Some records already exist: ${duplicateMsg}`, "error");
      } else {
        showToast("All records uploaded successfully!", "warning");
      }

      setSelectedFile(null);

      if (onUpload) onUpload(selectedFile, showToast);
    } catch (error: any) {
      console.error(error);
      showToast("Failed to upload records. Please check the file format or try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-primary-txt space-y-4 py-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Bulk Upload Travel Agents</h2>
        <p className="text-secondary-txt mt-2 text-sm">
          Upload a CSV or Excel file to create multiple travel agent records at once.
        </p>
      </div>

      <div className="bg-secondary hover:bg-secondary/60 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition">
        <CloudUploadIcon className="text-primary-txt mb-3 h-12 w-12" />
        <p className="text-secondary-txt mb-4 text-sm">Drag & drop your file here, or click below to select</p>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button component="span">Choose File</Button>
        </label>

        {selectedFile && (
          <div className="text-secondary-txt mt-4 flex items-center justify-center gap-2 text-sm">
            <InsertDriveFileIcon className="text-primary-txt h-5 w-5" />
            {selectedFile.name}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        {selectedFile && (
          <>
            <Button
              startIcon={<MdClear />}
              bgColor="#e53935"
              hoverColor="#c62828"
              onClick={() => setSelectedFile(null)}
            >
              Clear
            </Button>

            <Button
              startIcon={<MdSave />}
              bgColor="#2e7d32"
              hoverColor="#1b5e20"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload & Save"}
            </Button>
          </>
        )}
      </div>

      <div className="bg-secondary border-secondary/30 rounded-lg border p-4 text-sm">
        <p className="text-secondary-txt mb-3">
          Please make sure your file follows the correct format. You can download a ready-to-use sample file with
          required columns below:
        </p>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          onClick={() => {
            window.location.href = "/samples/sample-travel-agent.xlsx";
          }}
        >
          Download Sample Format
        </Button>
      </div>
    </div>
  );
};

export default AddMultipleTravelAgent;
