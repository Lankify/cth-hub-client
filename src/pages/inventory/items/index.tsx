import * as theme from "../../../theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button, SelectionTab, Table, ActionButtons, ConfirmDialog, useToast } from "../../../components";
import { ViewItemDetails, EditInventory } from "../../../pages";
import type { IInventory } from "../../../types";
import { MdLibraryAdd } from "react-icons/md";
import { FaImage } from "react-icons/fa6";

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [allItems, setAllItems] = useState<IInventory[]>([]);
  const [filteredItems, setFilteredItems] = useState<IInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewData, setViewData] = useState<IInventory | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState<IInventory | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const { showToast } = useToast();

  const columns = [
    { id: "imageUrl", label: "Item", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 120 },
    { id: "serialNumber", label: "Serial Number", minWidth: 120 },
    { id: "category", label: "Category", minWidth: 100 },
    { id: "brand", label: "Brand", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "assignedTo", label: "Assigned To", minWidth: 120 },
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/inventory/find-all`);

        if (Array.isArray(res.data)) {
          setAllItems(res.data);
          setFilteredItems(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setAllItems([]);
          setFilteredItems([]);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All Items") {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, allItems]);

  useEffect(() => {
    const filtered = allItems.filter(item => {
      const matchesCategory = selectedCategory === "All Items" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, allItems]);

  const validateForm = (data: IInventory) => {
    const requiredFields = ["name", "serialNumber", "category", "brand", "status"];

    if (data.status === "In Use") {
      requiredFields.push("assignedTo");
    }

    const missingFields = requiredFields.filter(field => !data[field as keyof IInventory]?.toString().trim());

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

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/inventory/update/${editData._id}`, updatedEditData);

      const updatedItems = allItems.map(item => (item._id === editData._id ? updatedEditData : item));
      setAllItems(updatedItems);
      setFilteredItems(updatedItems);
      setSelectedRowIds([]);
      showToast("Item updated successfully", "success");

      setEditOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating item:", error);
      showToast("Failed to update item", "error");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/inventory/delete/${id}`)));
      const updatedItems = allItems.filter(item => !ids.includes(item._id));
      setAllItems(updatedItems);
      setFilteredItems(updatedItems);
      setTableKey(prev => prev + 1);
      showToast("Item(s) deleted successfully", "error");
    } catch (err) {
      console.error("Error deleting items:", err);
      showToast("Failed to delete item(s)", "error");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteIds([]);
    }
  };

  return (
    <div>
      <h2 className={theme.text["main-title"]}>Inventory Overview</h2>
      <p className={theme.text["sub-title"]}>
        {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
      </p>
      <SelectionTab
        categories={["All Items", "Desktop", "Laptop", "Mobile Phone", "Camera", "Other"]}
        selectedCategory={selectedCategory}
        onChange={setSelectedCategory}
      />
      <div style={{ marginTop: "20px" }}>
        <Table
          key={tableKey}
          columns={columns}
          rows={filteredItems.map(item => ({
            ...item,
            imageUrl: item.imageUrl ? (
              <img src={item.imageUrl} alt="Item" style={{ width: "50px", height: "auto" }} />
            ) : (
              <div>
                <FaImage className="text-secondary-txt/90 mb-1 text-3xl" style={{ width: "50px", height: "auto" }} />
              </div>
            ),
            status: (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "2px",
                  fontWeight: 600,
                  backgroundColor:
                    item.status === "Available"
                      ? "var(--color-primary-green)"
                      : item.status === "In Use"
                        ? "#e5ad06"
                        : item.status === "Under Repair"
                          ? "var(--color-primary-red)"
                          : item.status === "Disposed"
                            ? "#808080"
                            : "transparent",
                }}
              >
                {item.status}
              </span>
            ),
            assignedTo: item.assignedTo ? (
              item.assignedTo
            ) : (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "2px",
                  backgroundColor: "#262f41",
                  color: "#ffffff",
                }}
              >
                Not Assigned
              </span>
            ),
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
                    const item = allItems.find(i => i._id === selectedIds[0]);
                    if (item) {
                      setViewData(item);
                      setViewOpen(true);
                    }
                  }}
                  onEdit={() => {
                    const item = allItems.find(i => i._id === selectedIds[0]);
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
              <Button startIcon={<MdLibraryAdd />} onClick={() => navigate("/inventory/new-item")}>
                Add New Item
              </Button>
            </div>
          )}
        />
      </div>

      {/* Dialog Box to View Details */}
      <ConfirmDialog
        open={viewOpen}
        title="Item Details"
        content={viewData ? <ViewItemDetails data={viewData} /> : null}
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
        title="Edit Item"
        content={editData ? <EditInventory data={editData} onChange={updated => setEditData(updated)} /> : null}
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
          // minHeight: "400px",
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
        content="Are you sure you want to delete the selected item(s)? This action cannot be undone."
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

export default Inventory;
