import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  Toolbar,
} from "@mui/material";
import { ActionButtons } from "../../components";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  rowsPerPageOptions?: number[];
  stickyHeader?: boolean;
  transparent?: boolean;
  enableCheckbox?: boolean;
  onSelectRow?: (selectedIds: string[]) => void;
  renderActions?: (selectedIds: string[]) => React.ReactNode;
  renderToolbar?: (selectedIds: string[]) => React.ReactNode;
  selectedRowIds?: string[];
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 25],
  stickyHeader = true,
  transparent = true,
  enableCheckbox = false,
  onSelectRow,
  renderActions,
  renderToolbar,
  selectedRowIds,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>(selectedRowIds || []);
  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map(row => row._id || row.id);
      setSelectedIds(newSelected);
      onSelectRow?.(newSelected);
    } else {
      setSelectedIds([]);
      onSelectRow?.([]);
    }
  };

  const handleRowClick = (id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedIds, id];
    } else {
      newSelected = selectedIds.filter(item => item !== id);
    }

    setSelectedIds(newSelected);
    onSelectRow?.(newSelected);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    if (selectedRowIds) {
      setSelectedIds(selectedRowIds);
    }
  }, [selectedRowIds]);

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: transparent ? "transparent" : "white",
        boxShadow: transparent ? "none" : undefined,
        color: "var(--color-primary-txt)",
      }}
      elevation={transparent ? 0 : 1}
    >
      {enableCheckbox && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { sm: 2 },
            backgroundColor: "var(--color-tertiary)",
            color: "var(--color-primary-txt)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "64px",
          }}
        >
          {selectedIds.length > 0
            ? (renderActions?.(selectedIds) ?? (
                <ActionButtons
                  onView={() => console.log("View", selectedIds)}
                  onEdit={() => console.log("Edit", selectedIds)}
                  onDelete={() => console.log("Delete", selectedIds)}
                />
              ))
            : renderToolbar?.(selectedIds)}
        </Toolbar>
      )}

      <TableContainer sx={{ maxHeight: 480 }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-secondary)" }}>
              {enableCheckbox && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary-txt)",
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "var(--color-primary-txt)",
                      "&.Mui-checked": {
                        color: "var(--color-neutral)",
                      },
                    }}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < visibleRows.length}
                    checked={visibleRows.length > 0 && selectedIds.length === visibleRows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map(col => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  style={{ minWidth: col.minWidth }}
                  sx={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary-txt)",
                    fontWeight: 600,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row, idx) => {
              const rowId = row._id || row.id || String(idx);
              return (
                <TableRow
                  hover
                  key={rowId}
                  selected={isSelected(rowId)}
                  role="checkbox"
                  aria-checked={isSelected(rowId)}
                >
                  {enableCheckbox && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(rowId)}
                        onChange={() => handleRowClick(rowId)}
                        sx={{
                          color: "var(--color-primary-txt)",
                          "&.Mui-checked": {
                            color: "var(--color-neutral)",
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map(col => (
                    <TableCell key={col.id} align={col.align || "left"} sx={{ color: "var(--color-primary-txt)" }}>
                      {row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: "var(--color-primary-txt)",
          ".MuiTablePagination-toolbar": {
            color: "var(--color-primary-txt)",
          },
          ".MuiSvgIcon-root": {
            color: "var(--color-primary-txt)",
          },
          ".Mui-disabled": {
            color: "var(--color-secondary-txt)",
          },
        }}
      />
    </Paper>
  );
};

export default DataTable;
