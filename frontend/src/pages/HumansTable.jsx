import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const HumansTable = ({ humans }) => (
  <TableContainer component={Paper}>
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Roles</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {humans.map((human) => (
          <TableRow key={human.id}>
            <TableCell component="th" scope="row">
              {human.name || ""}
            </TableCell>
            <TableCell>
              {human.roles
                ? human.roles.map((role) => role.position).join(" | ")
                : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default HumansTable;
