import React from "react";
import useHumans from "../context/useHumans";
import HumansTable from "./HumansTable";

const HumansPage = () => {
  const humans = useHumans();

  return (
    <div>
      <HumansTable humans={humans} />
    </div>
  );
};

export default HumansPage;
