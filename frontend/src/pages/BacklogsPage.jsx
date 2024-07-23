import React from "react";
import useBacklogs from "../context/useBacklogs";
import BacklogTable from "./BacklogsTable";

const BacklogPage = () => {
  const backlogs = useBacklogs();

  return (
    <div>
      <BacklogTable backlogs={backlogs} />
    </div>
  );
};

export default BacklogPage;
