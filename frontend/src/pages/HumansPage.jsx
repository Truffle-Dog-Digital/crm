import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./HumansPage.css";

const HumansPage = () => {
  const { user } = useAuth();
  const [humans, setHumans] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      const humansCollection = collection(db, `users/${user.uid}/humans`);
      const unsubscribe = onSnapshot(humansCollection, (snapshot) => {
        const humansList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHumans(humansList);
      });

      return () => unsubscribe();
    }
  }, [user, db]);

  // Check if humans is defined and not empty
  if (!humans || humans.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-container">
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="table-header-cell">Name</TableCell>
              <TableCell className="table-header-cell">Roles</TableCell>
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
    </div>
  );
};

export default HumansPage;
