import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDueDiligence } from "../../redux/business/action";
import DueDiligenceComp from "../../components/dueDiligence";

export default function DueDiligence() {
  const dispatch = useDispatch();

  const diligence = useSelector(state => state.business.diligence);

  useEffect(() => {
    dispatch(getDueDiligence());
  }, [dispatch]);

  const { browserSubscribed, geoSubscribed, amlSubscribed } = diligence || {};

  return (
    <DueDiligenceComp
      browserData={browserSubscribed}
      geoData={geoSubscribed}
      amlData={amlSubscribed}
    />
  );
}
