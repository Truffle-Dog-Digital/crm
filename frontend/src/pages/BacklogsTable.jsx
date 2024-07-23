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
} from "@mui/material";
import useBacklogsTable from "./useBacklogsTable";

const BacklogsTable = ({ backlogs }) => {
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
  } = useBacklogsTable();

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
                    selected.length > 0 && selected.length < backlogs.length
                  }
                  checked={
                    backlogs.length > 0 && selected.length === backlogs.length
                  }
                  onChange={(event) => handleSelectAllClick(event, backlogs)}
                  inputProps={{
                    "aria-label": "select all backlogs",
                  }}
                />
              </TableCell>
              <TableCell sortDirection={orderBy === "profile" ? order : false}>
                <TableSortLabel
                  active={orderBy === "profile"}
                  direction={orderBy === "profile" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "profile")}
                >
                  Profile
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(backlogs, getComparator(order, orderBy)).map(
              (backlog, index) => {
                const isItemSelected = isSelected(backlog.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, backlog.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={backlog.id}
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
                      {backlog.profile || ""}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BacklogsTable;
