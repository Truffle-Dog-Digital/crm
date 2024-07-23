import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Checkbox,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useHumans from "../context/useHumans";
import useHumansTable from "./useHumansTable";

const HumansTable = () => {
  const humans = useHumans();
  const {
    order,
    orderBy,
    selected,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    isSelected,
    stableSort,
    getComparator,
  } = useHumansTable();

  return (
    <Paper
      sx={{
        width: "100%",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < humans.length
                  }
                  checked={
                    humans.length > 0 && selected.length === humans.length
                  }
                  onChange={(event) => handleSelectAllClick(event, humans)}
                  inputProps={{
                    "aria-label": "select all humans",
                  }}
                />
              </TableCell>
              <TableCell sortDirection={orderBy === "name" ? order : false}>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "roles" ? order : false}>
                <TableSortLabel
                  active={orderBy === "roles"}
                  direction={orderBy === "roles" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "roles")}
                >
                  Roles
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(humans, getComparator(order, orderBy)).map(
              (human, index) => {
                const isItemSelected = isSelected(human.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, human.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={human.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row">
                      {human.name || ""}
                    </TableCell>
                    <TableCell>
                      {human.roles
                        ? human.roles.map((role) => role.position).join(" | ")
                        : ""}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ height: "64px" }} />
    </Paper>
  );
};

export default HumansTable;
