import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ApprovalsComp from "../../components/approvals";
import { fetchApprovals } from "../../redux/approvals/action";
import { getRoute } from "../../utils";
import CONSTANTS from "../../constants";

const {
  ROUTES: { APPROVALS_DETAILS }
} = CONSTANTS;

export default function Approvals() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState();

  const approvals = useSelector(state => state.approvals.approvals);

  useEffect(() => {
    dispatch(fetchApprovals({ search })).finally(() => setLoading(false));
  }, [dispatch, search]);

  const productOptions = [
    {
      name: "POS",
      value: 2
    }
  ];

  const handleCheckProfile = (uid, name, businessId) => {
    history.push({
      pathname: getRoute(APPROVALS_DETAILS, { id: uid }),
      state: { name: name, businessId: businessId }
    });
  };

  const handleSearch = q => {
    setSearch(q);
  };

  return (
    <ApprovalsComp
      data={approvals}
      loading={loading}
      handleSearch={handleSearch}
      productOptions={productOptions}
      handleCheckProfile={handleCheckProfile}
    />
  );
}
