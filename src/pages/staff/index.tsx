import * as theme from "../../theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button, Table, MultiSelectDropdown, ActionButtons, ConfirmDialog, useToast } from "../../components";
import { ViewStaffMember, EditStaffMember, AssignRole } from "../../pages";
import type { IStaff, IUser } from "../../types";
import { FiUserPlus } from "react-icons/fi";
import { BiSolidUserPin } from "react-icons/bi";
import { FaUserCog } from "react-icons/fa";

const Staff: React.FC = () => {
  const navigate = useNavigate();
  const [allStaff, setAllStaff] = useState<IStaff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<IStaff[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const [viewData, setViewData] = useState<IStaff | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [assignRoleData, setAssignRoleData] = useState<IUser | null>(null);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [assignRoleStaff, setAssignRoleStaff] = useState<IStaff | null>(null);
  const [editData, setEditData] = useState<IStaff | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const { showToast } = useToast();

  const departmentOptions = Array.from(
    new Set(allStaff.map(staff => staff.department).filter((dep): dep is string => Boolean(dep))),
  ).map(dep => ({
    _id: dep,
    name: dep,
  }));

  const statusOptions = Array.from(
    new Set(allStaff.map(staff => staff.status).filter((dep): dep is string => Boolean(dep))),
  ).map(dep => ({
    _id: dep,
    name: dep,
  }));

  const columns = [
    { id: "profileImageUrl", label: "Profile", minWidth: 100 },
    { id: "staffId", label: "Emp No.", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 120 },
    { id: "designation", label: "Designation", minWidth: 120 },
    { id: "department", label: "Department", minWidth: 120 },
    { id: "status", label: "Status", minWidth: 120 },
    { id: "joinedDate", label: "Joined Date", minWidth: 120 },
  ];

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/staff/find-all`);
      if (Array.isArray(res.data)) {
        setAllStaff(res.data);
        setFilteredStaff(res.data);
      } else {
        setAllStaff([]);
        setFilteredStaff([]);
      }
    } catch (err) {
      console.error("Error fetching staff details:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const filtered = allStaff.filter(staff => {
      const matchesSearch =
        staff.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDepartment = selectedDepartment.length === 0 || selectedDepartment.includes(staff.department || "");
      const matchStatus = selectedStatus.length === 0 || selectedStatus.includes(staff.status || "");

      return matchesSearch && matchDepartment && matchStatus;
    });

    setFilteredStaff(filtered);
  }, [searchQuery, allStaff, selectedDepartment, selectedStatus]);

  const validateForm = (data: IStaff) => {
    const requiredFields = [
      "staffId",
      "firstName",
      "lastName",
      "email",
      "phone",
      "designation",
      "joinedDate",
      "status",
    ];

    const missingFields = requiredFields.filter(field => !data[field as keyof IStaff]?.toString().trim());

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

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/staff/update/${editData._id}`, updatedEditData);

      const updatedDetails = allStaff.map(staff => (staff._id === editData._id ? updatedEditData : staff));
      setAllStaff(updatedDetails);
      setFilteredStaff(updatedDetails);
      setSelectedRowIds([]);
      showToast("Staff Member updated successfully", "success");

      setEditOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating details:", error);
      showToast("Failed to update details", "error");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/staff/delete/${id}`)));
      const updatedDetails = allStaff.filter(staff => !ids.includes(staff._id));
      setAllStaff(updatedDetails);
      setFilteredStaff(updatedDetails);
      setTableKey(prev => prev + 1);
      showToast("Staff member(s) deleted successfully", "error");
    } catch (err) {
      console.error("Error deleting staff member(s):", err);
      showToast("Failed to delete staff member(s)", "error");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteIds([]);
    }
  };

  return (
    <div>
      <h2 className={theme.text["main-title"]}>Staff Overview</h2>
      <p className={theme.text["sub-title"]}>
        {filteredStaff.length} {filteredStaff.length === 1 ? "person" : "people"} found
      </p>

      <div style={{ marginTop: "20px" }}>
        <Table
          key={tableKey}
          columns={columns}
          rows={filteredStaff.map(staff => ({
            ...staff,
            profileImageUrl: staff.profileImageUrl ? (
              <img src={staff.profileImageUrl} alt="Profile" style={{ width: "60px", height: "auto" }} />
            ) : (
              <div>
                {" "}
                <BiSolidUserPin
                  className="text-secondary-txt/90 mb-1 text-3xl"
                  style={{ width: "50px", height: "auto" }}
                />
              </div>
            ),
            name: `${staff.firstName} ${staff.lastName}`,
            status: (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "2px",
                  fontWeight: 600,
                  backgroundColor:
                    staff.status === "Current" ? "var(--color-primary-green)" : "var(--color-primary-red)",
                }}
              >
                {staff.status}
              </span>
            ),
            joinedDate: staff.joinedDate
              ? new Date(staff.joinedDate)
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
                <div className="flex gap-2">
                  <Button
                    startIcon={<FaUserCog />}
                    onClick={() => {
                      const staff = allStaff.find(i => i._id === selectedIds[0]);
                      if (staff) {
                        setAssignRoleData({
                          staff: staff._id,
                          username: staff.email || "",
                          role: { _id: "", name: "", permissions: [] },
                          isActive: true,
                        });
                        setAssignRoleStaff(staff);
                        setAssignRoleOpen(true);
                      }
                    }}
                    bgColor="var(--color-primary)"
                    hoverColor="#121524"
                    color="info"
                  >
                    Assign Role
                  </Button>

                  {/* Default Action Buttons */}
                  <ActionButtons
                    onView={() => {
                      const staff = allStaff.find(i => i._id === selectedIds[0]);
                      if (staff) {
                        setViewData(staff);
                        setViewOpen(true);
                      }
                    }}
                    onEdit={() => {
                      const staff = allStaff.find(i => i._id === selectedIds[0]);
                      if (staff) {
                        setEditData(staff);
                        setEditOpen(true);
                      }
                    }}
                    onDelete={() => {
                      setPendingDeleteIds(selectedIds);
                      setConfirmOpen(true);
                    }}
                  />
                </div>
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
                label="Filter by Department"
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                options={departmentOptions}
                multiple={true}
                minWidth={200}
              />
              <MultiSelectDropdown
                label="Filter by Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                multiple={true}
                minWidth={200}
              />
              <Button startIcon={<FiUserPlus />} onClick={() => navigate("/staff/new-member")}>
                New Member
              </Button>
            </div>
          )}
        />
      </div>

      {/* Dialog Box to Assign a New User */}
      <ConfirmDialog
        open={assignRoleOpen}
        title="Assign User Role"
        content={
          assignRoleData ? (
            <AssignRole
              staff={assignRoleStaff!}
              user={assignRoleData!}
              onChange={updated => setAssignRoleData(updated)}
            />
          ) : null
        }
        onClose={() => setAssignRoleOpen(false)}
        actions={[
          {
            label: "Save",
            onClick: async () => {
              if (!assignRoleData) return;

              try {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/create`, assignRoleData);
                showToast("New user created successfully", "success");
              } catch (err: any) {
                console.error(err);

                const backendMessage = err.response?.data?.message;

                if (backendMessage) {
                  showToast(backendMessage, "error");
                } else {
                  showToast("Failed to assign user role", "error");
                }
              } finally {
                setAssignRoleOpen(false);
                setAssignRoleData(null);
                setAssignRoleStaff(null);
              }
            },
            color: "info",
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

      {/* Dialog Box to View Details */}
      <ConfirmDialog
        open={viewOpen}
        title="Staff Member Details"
        content={viewData ? <ViewStaffMember data={viewData} /> : null}
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
            color: "inherit",
            variant: "outlined",
          },
        ]}
        showDividers
      />

      {/* Dialog Box to Edit Details */}
      <ConfirmDialog
        open={editOpen}
        title="Edit Staff Details"
        content={editData ? <EditStaffMember data={editData} onChange={updated => setEditData(updated)} /> : null}
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
        content="Are you sure you want to delete the selected staff member(s)? This action cannot be undone."
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

export default Staff;
