import * as theme from "../../../theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button, Table, MultiSelectDropdown, ActionButtons, ConfirmDialog, useToast } from "../../../components";
import { ViewTravelAgents, EditTravelAgent, AddTravelAgentOptions, AddMultipleTravelAgents } from "../../../pages";
import type { ITravelAgent } from "../../../types";
import { MdLibraryAdd } from "react-icons/md";

const TravelAgents: React.FC = () => {
  const navigate = useNavigate();
  const [allTravelAgents, setAllTravelAgents] = useState<ITravelAgent[]>([]);
  const [filteredTravelAgents, setFilteredTravelAgents] = useState<ITravelAgent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [viewData, setViewData] = useState<ITravelAgent | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editData, setEditData] = useState<ITravelAgent | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const { showToast } = useToast();

  const countryOptions = Array.from(
    new Set(allTravelAgents.map(TravelAgents => TravelAgents.country).filter((dep): dep is string => Boolean(dep))),
  ).map(dep => ({
    _id: dep,
    name: dep,
  }));

  const cityOptions = Array.from(
    new Set(allTravelAgents.map(TravelAgents => TravelAgents.city).filter((dep): dep is string => Boolean(dep))),
  ).map(dep => ({
    _id: dep,
    name: dep,
  }));

  const columns = [
    { id: "name", label: "Name", minWidth: 120 },
    { id: "ownerName", label: "Contact Person", minWidth: 120 },
    { id: "email", label: "Email", minWidth: 120 },
    { id: "phone", label: "Phone", minWidth: 120 },
    { id: "country", label: "Country", minWidth: 120 },
    { id: "website", label: "Website", minWidth: 120 },
  ];

  const fetchTravelAgents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/travel-agents/find-all`);
      if (Array.isArray(res.data)) {
        setAllTravelAgents(res.data);
        setFilteredTravelAgents(res.data);
      } else {
        setAllTravelAgents([]);
        setFilteredTravelAgents([]);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    fetchTravelAgents();
  }, []);

  useEffect(() => {
    const filtered = allTravelAgents.filter(travelAgent => {
      const matchesSearch =
        travelAgent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        travelAgent.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        travelAgent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        travelAgent.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        travelAgent.website?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDepartment = selectedCountry.length === 0 || selectedCountry.includes(travelAgent.country || "");
      const matchStatus = selectedCity.length === 0 || selectedCity.includes(travelAgent.city || "");

      return matchesSearch && matchDepartment && matchStatus;
    });

    setFilteredTravelAgents(filtered);
  }, [searchQuery, allTravelAgents, selectedCountry, selectedCity]);

  const validateForm = (data: ITravelAgent) => {
    const requiredFields = ["name", "email", "phone"];

    const missingFields = requiredFields.filter(field => !data[field as keyof ITravelAgent]?.toString().trim());

    if (missingFields.length > 0) {
      showToast("Please fill all required fields", "warning");
      return false;
    }

    return true;
  };

  const handleEdit = async () => {
    if (!editData) return;

    if (!validateForm(editData)) {
      return;
    }

    try {
      const updatedEditData = {
        ...editData,
        updatedAt: new Date().toISOString(),
      };

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/travel-agents/update/${editData._id}`, updatedEditData);

      const updatedTravelAgents = allTravelAgents.map(category =>
        category._id === editData._id ? updatedEditData : category,
      );
      setAllTravelAgents(updatedTravelAgents);
      setFilteredTravelAgents(updatedTravelAgents);
      setSelectedRowIds([]);
      showToast("Record updated successfully", "success");

      setEditOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating record:", error);
      showToast("Failed to update record", "error");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/travel-agents/delete/${id}`)));
      const updatedTravelAgents = allTravelAgents.filter(travelAgent => !ids.includes(travelAgent._id));
      setAllTravelAgents(updatedTravelAgents);
      setFilteredTravelAgents(updatedTravelAgents);
      setTableKey(prev => prev + 1);
      showToast("Record(s) deleted successfully", "error");
    } catch (err) {
      console.error("Error deleting record(s):", err);
      showToast("Failed to delete record(s)", "error");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteIds([]);
    }
  };

  return (
    <div>
      <h2 className={theme.text["main-title"]}>Travel Agents</h2>
      <p className={theme.text["sub-title"]}>
        {filteredTravelAgents.length} {filteredTravelAgents.length === 1 ? "record" : "records"} found
      </p>

      <div style={{ marginTop: "20px" }}>
        <Table
          key={tableKey}
          columns={columns}
          defaultRowsPerPage={10}
          rows={filteredTravelAgents.map(travelAgent => ({
            ...travelAgent,
            email: (
              <a href={`mailto:${travelAgent.email}`} className="text-blue-600 hover:text-blue-800">
                {travelAgent.email}
              </a>
            ),
            phone: (
              <a href={`tel:${travelAgent.phone}`} className="text-blue-600 hover:text-blue-800">
                {travelAgent.phone}
              </a>
            ),
            website: travelAgent.website ? (
              <a
                href={travelAgent.website.startsWith("http") ? travelAgent.website : `https://${travelAgent.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {travelAgent.website}
              </a>
            ) : (
              "N/A"
            ),
            createdAt: travelAgent.createdAt
              ? new Date(travelAgent.createdAt)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/ (\w+) (\d{4})$/, " $1, $2")
              : "N/A",
          }))}
          enableCheckbox
          selectedRowIds={selectedRowIds}
          onSelectRow={ids => setSelectedRowIds(ids)}
          renderActions={selectedIds => (
            <>
              <Typography>{selectedIds.length} selected</Typography>
              {selectedIds.length === 1 ? (
                <ActionButtons
                  onView={() => {
                    const item = allTravelAgents.find(i => i._id === selectedIds[0]);
                    if (item) {
                      setViewData(item);
                      setViewOpen(true);
                    }
                  }}
                  onEdit={() => {
                    const item = allTravelAgents.find(i => i._id === selectedIds[0]);
                    if (item) {
                      setEditData(item);
                      setEditOpen(true);
                    }
                  }}
                  onDelete={() => {
                    setPendingDeleteIds(selectedIds);
                    setConfirmOpen(true);
                  }}
                />
              ) : (
                <ActionButtons
                  onDelete={() => {
                    setPendingDeleteIds(selectedIds);
                    setConfirmOpen(true);
                  }}
                />
              )}
            </>
          )}
          renderToolbar={() => (
            <div className="flex w-full items-center justify-center gap-4">
              <input
                type="text"
                className={`${theme.textField.searchInput} py-1`}
                placeholder="Looking for..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <MultiSelectDropdown
                label="Filter by Country"
                value={selectedCountry}
                onChange={setSelectedCountry}
                options={countryOptions}
                multiple={true}
                minWidth={200}
              />
              <MultiSelectDropdown
                label="Filter by City"
                value={selectedCity}
                onChange={setSelectedCity}
                options={cityOptions}
                multiple={true}
                minWidth={200}
              />
              <Button startIcon={<MdLibraryAdd />} onClick={() => setNewOpen(true)}>
                New Record
              </Button>
            </div>
          )}
        />
      </div>

      {/* Dialog Box to Create New Travel Agent */}
      <ConfirmDialog
        open={newOpen}
        title="New Record"
        content={
          <AddTravelAgentOptions
            onSingle={() => {
              setNewOpen(false);
              navigate("/contacts/travel-agents/new-travel-agent");
            }}
            onBulk={() => {
              setNewOpen(false);
              setBulkUploadOpen(true);
            }}
          />
        }
        showCancelButton={false}
        onClose={() => {
          setNewOpen(false);
        }}
        actions={[
          {
            label: "Close",
            onClick: () => {
              setNewOpen(false);
            },
            color: "primary",
            variant: "outlined",
          },
        ]}
        showDividers
      />

      {/* Dialog Box for Bulk Upload */}
      <ConfirmDialog
        open={bulkUploadOpen}
        title="Bulk Upload"
        content={
          <AddMultipleTravelAgents
            onUpload={async () => {
              setBulkUploadOpen(false);
              await fetchTravelAgents();
            }}
            showToast={showToast}
          />
        }
        showCancelButton={false}
        onClose={() => setBulkUploadOpen(false)}
        actions={[
          {
            label: "Go Back",
            onClick: () => {
              setBulkUploadOpen(false);
              setNewOpen(true);
            },
            color: "primary",
            variant: "outlined",
          },
          {
            label: "Close",
            onClick: () => setBulkUploadOpen(false),
            color: "primary",
            variant: "outlined",
          },
        ]}
        showDividers
      />

      {/* Dialog Box to View Details */}
      <ConfirmDialog
        open={viewOpen}
        title="Travel Agent Details"
        content={viewData ? <ViewTravelAgents data={viewData} /> : null}
        showCancelButton={false}
        contentSx={{
          maxHeight: "500px",
          minHeight: "400px",
          minWidth: "500px",
          overflowY: "auto",
          color: "var(--color-primary-txt)",
          px: 3,
          py: 1,
        }}
        actions={[
          {
            label: "Close",
            onClick: () => {
              setViewOpen(false);
              setViewData(null);
            },
            color: "primary",
            variant: "outlined",
          },
        ]}
        showDividers
      />

      {/* Dialog Box to Edit Details */}
      <ConfirmDialog
        open={editOpen}
        title="Edit Record"
        content={editData ? <EditTravelAgent data={editData} onChange={updated => setEditData(updated)} /> : null}
        onClose={() => setEditOpen(false)}
        actions={[
          {
            label: "Update",
            onClick: handleEdit,
            color: "success",
            variant: "contained",
          },
        ]}
        showDividers
        contentSx={{
          maxHeight: "500px",
          minWidth: "500px",
          overflowY: "auto",
          px: 3,
          py: 1,
        }}
      />

      {/* Dialog Box to Delete Details */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Confirmation"
        content="Are you sure you want to delete the selected record(s)? This action cannot be undone."
        onClose={() => setConfirmOpen(false)}
        actions={[
          {
            label: "Delete",
            onClick: () => handleDelete(pendingDeleteIds),
            color: "error",
            variant: "contained",
          },
        ]}
      />
    </div>
  );
};

export default TravelAgents;
