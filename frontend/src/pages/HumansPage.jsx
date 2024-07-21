import React from "react";
import useHumans from "../context/useHumans";
import HumansTable from "./HumansTable";
import Loading from "../components/Loading";

const HumansPage = () => {
  const humans = useHumans();

  if (!humans || humans.length === 0) {
    return <Loading />;
  }

  return (
    <div>
      <HumansTable humans={humans} />
    </div>
  );
};

export default HumansPage;
