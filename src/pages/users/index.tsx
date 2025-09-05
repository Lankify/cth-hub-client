import * as theme from "../../theme";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button, Table, ActionButtons, ConfirmDialog, useToast } from "../../components";
import { ViewUserDetails, EditItemCategory, AddUser } from "../../pages"; // chnage
import type { AddUserRef } from "../../pages";
import type { IUser } from "../../types";
import { useStaff, useUserRoles } from "../../hooks";
import { MdLibraryAdd } from "react-icons/md";
import { FaImage } from "react-icons/fa6";

const Users: React.FC = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewData, setViewData] = useState<IUser | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const addUserRef = useRef<AddUserRef>(null);
  const { staff } = useStaff();
  const { roles } = useUserRoles();
  const [createLoading, setCreateLoading] = useState(false);
  const [editData, setEditData] = useState<IUser | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const { showToast } = useToast();

  const columns = [
    { id: "profileImage", label: "Profile", minWidth: 80 },

    { id: "staff", label: "Name", minWidth: 120 },
    { id: "role", label: "Role", minWidth: 120 },
    { id: "username", label: "Username", minWidth: 120 },
    { id: "password", label: "Password", minWidth: 120 },
    { id: "isActive", label: "Status", minWidth: 100 },
  ];

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/find-all`);
      if (Array.isArray(res.data.data)) {
        setAllUsers(res.data.data);
        setFilteredUsers(res.data.data);
      } else {
        setAllUsers([]);
        setFilteredUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(user => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    setFilteredUsers(filtered);
  }, [searchQuery, allUsers]);

  const validateForm = (data: IUser) => {
    const requiredFields = ["username", "password", "role"];

    const missingFields = requiredFields.filter(field => !data[field as keyof IUser]?.toString().trim());

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

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/update/${editData._id}`, updatedEditData);

      const updatedUsers = allUsers.map(user => (user._id === editData._id ? updatedEditData : user));
      setAllUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectedRowIds([]);
      showToast("User updated successfully", "success");

      setEditOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Failed to update user", "error");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      const validIds = ids.filter((id): id is string => !!id);

      await Promise.all(validIds.map(id => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/delete/${id}`)));

      const updatedUsers = allUsers.filter(user => user._id && !validIds.includes(user._id));
      setAllUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setTableKey(prev => prev + 1);
      showToast("User(s) deleted successfully", "error");
    } catch (err) {
      console.error("Error deleting user(s):", err);
      showToast("Failed to delete user(s)", "error");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteIds([]);
    }
  };

  return (
    <div>
      <h2 className={theme.text["main-title"]}>User Accounts</h2>
      <p className={theme.text["sub-title"]}>
        {filteredUsers.length} {filteredUsers.length === 1 ? "account" : "accounts"} found
      </p>

      <div style={{ marginTop: "20px" }}>
        <Table
          key={tableKey}
          columns={columns}
          rows={filteredUsers.map(user => ({
            ...user,
            profileImage:
              user.staff && typeof user.staff !== "string" && user.staff.profileImageUrl ? (
                <img src={user.staff.profileImageUrl} alt="User Profile" style={{ width: "60px", height: "auto" }} />
              ) : (
                <div>
                  <FaImage className="text-secondary-txt/90 mb-1 text-3xl" style={{ width: "50px", height: "auto" }} />
                </div>
              ),
            staff:
              user.staff && typeof user.staff !== "string" ? `${user.staff.firstName} ${user.staff.lastName}` : "N/A",
            role: user.role?.name || "N/A",
            password: <span>••••••••••••••••••••••••</span>,
            isActive: (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "2px",
                  fontWeight: 600,
                  backgroundColor: user.isActive ? "var(--color-primary-green)" : "var(--color-primary-red)",
                  color: "#fff",
                }}
              >
                {user.isActive ? "Active" : "Deactive"}
              </span>
            ),
            createdAt: user.createdAt
              ? new Date(user.createdAt)
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
                    const item = allUsers.find(i => i._id === selectedIds[0]);
                    if (item) {
                      setViewData(item);
                      setViewOpen(true);
                    }
                  }}
                  onEdit={() => {
                    const item = allUsers.find(i => i._id === selectedIds[0]);
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
              <Button startIcon={<MdLibraryAdd />} onClick={() => setNewOpen(true)}>
                New User Account
              </Button>
            </div>
          )}
        />
      </div>

      {/* Dialog Box to Create New User */}
      <ConfirmDialog
        open={newOpen}
        title="Add New User"
        content={
          <AddUser
            ref={addUserRef}
            onSuccess={() => {
              setNewOpen(false);
              fetchUsers();
            }}
            setLoading={setCreateLoading}
            staffOptions={staff.map(s => ({
              _id: s._id,
              staffId: s.staffId,
              name: `${s.firstName} ${s.lastName}`,
              profileImageUrl: s.profileImageUrl,
            }))}
            roleOptions={roles.map(r => ({ _id: r._id, name: r.name }))}
          />
        }
        onClose={() => setNewOpen(false)}
        actions={[
          {
            label: createLoading ? "Creating..." : "Create",
            onClick: () => addUserRef.current?.handleSubmit(),
            color: "info",
            variant: "contained",
            props: { disabled: createLoading },
          },
        ]}
        showDividers
      />

      {/* Dialog Box to View Details */}
      <ConfirmDialog
        open={viewOpen}
        title="User Details"
        content={viewData ? <ViewUserDetails data={viewData} /> : null}
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
      {/* <ConfirmDialog
        open={editOpen}
        title="Edit User"
        content={editData ? <EditItemCategory data={editData} onChange={updated => setEditData(updated)} /> : null}
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
      /> */}

      {/* Dialog Box to Delete Details */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Confirmation"
        content="Are you sure you want to delete the selected user(s)? This action cannot be undone."
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

export default Users;
