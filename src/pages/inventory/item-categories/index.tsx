import * as theme from "../../../theme";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button, Table, ActionButtons, ConfirmDialog, useToast } from "../../../components";
import { ViewCategoryDetails, EditItemCategory, AddItemCategory } from "../../../pages";
import type { AddItemCategoryRef } from "../../../pages";
import type { IItemCategory } from "../../../types";
import { MdLibraryAdd } from "react-icons/md";

const ItemCategories: React.FC = () => {
  const [allCategories, setAllCategories] = useState<IItemCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<IItemCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewData, setViewData] = useState<IItemCategory | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const addCategoryRef = useRef<AddItemCategoryRef>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editData, setEditData] = useState<IItemCategory | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const { showToast } = useToast();

  const columns = [
    { id: "imageUrl", label: "Image", minWidth: 100 },
    { id: "categoryId", label: "# ID", minWidth: 120 },
    { id: "category", label: "Category", minWidth: 120 },
    { id: "createdAt", label: "Created On", minWidth: 120 },
  ];

  const fetchItemCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/inventory/find-all-categories`);
      if (Array.isArray(res.data)) {
        setAllCategories(res.data);
        setFilteredCategories(res.data);
      } else {
        setAllCategories([]);
        setFilteredCategories([]);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    fetchItemCategories();
  }, []);

  useEffect(() => {
    const filtered = allCategories.filter(category => {
      const matchesSearch =
        category.categoryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    setFilteredCategories(filtered);
  }, [searchQuery, allCategories]);

  const validateForm = (data: IItemCategory) => {
    const requiredFields = ["categoryId", "category"];

    const missingFields = requiredFields.filter(field => !data[field as keyof IItemCategory]?.toString().trim());

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

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/update-category/${editData._id}`,
        updatedEditData,
      );

      const updatedCategories = allCategories.map(category =>
        category._id === editData._id ? updatedEditData : category,
      );
      setAllCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      setSelectedRowIds([]);
      showToast("Category updated successfully", "success");

      setEditOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating category:", error);
      showToast("Failed to update category", "error");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map(id => axios.delete(`${import.meta.env.VITE_API_BASE_URL}/inventory/delete-category/${id}`)),
      );
      const updatedCategories = allCategories.filter(category => !ids.includes(category._id));
      setAllCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      setTableKey(prev => prev + 1);
      showToast("Category(s) deleted successfully", "error");
    } catch (err) {
      console.error("Error deleting categories:", err);
      showToast("Failed to delete category(s)", "error");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteIds([]);
    }
  };

  return (
    <div>
      <h2 className={theme.text["main-title"]}>Item Categories</h2>
      <p className={theme.text["sub-title"]}>
        {filteredCategories.length} {filteredCategories.length === 1 ? "item" : "items"} found
      </p>

      <div style={{ marginTop: "20px" }}>
        <Table
          key={tableKey}
          columns={columns}
          rows={filteredCategories.map(item => ({
            ...item,
            imageUrl: item.imageUrl ? (
              <img src={item.imageUrl} alt="Item" style={{ width: "60px", height: "auto" }} />
            ) : (
              "No image"
            ),
            createdAt: item.createdAt
              ? new Date(item.createdAt)
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
                    const item = allCategories.find(i => i._id === selectedIds[0]);
                    if (item) {
                      setViewData(item);
                      setViewOpen(true);
                    }
                  }}
                  onEdit={() => {
                    const item = allCategories.find(i => i._id === selectedIds[0]);
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
                New Category
              </Button>
            </div>
          )}
        />
      </div>

      {/* Dialog Box to Create New Category */}
      <ConfirmDialog
        open={newOpen}
        title="Add New Category"
        content={
          <AddItemCategory
            ref={addCategoryRef}
            onSuccess={() => {
              setNewOpen(false);
              fetchItemCategories();
            }}
            setLoading={setCreateLoading}
          />
        }
        onClose={() => {
          setNewOpen(false);
        }}
        actions={[
          {
            label: createLoading ? "Creating..." : "Create",
            onClick: () => addCategoryRef.current?.handleSubmit(),
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
        title="Category Details"
        content={viewData ? <ViewCategoryDetails data={viewData} /> : null}
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
        title="Edit Category"
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
      />

      {/* Dialog Box to Delete Details */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Confirmation"
        content="Are you sure you want to delete the selected category(s)? This action cannot be undone."
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

export default ItemCategories;
