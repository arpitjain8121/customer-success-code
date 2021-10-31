// import nAxios from "../../services/nAxios";

import { FETCH_APPROVALS } from "./types";

export const fetchApprovals = () => {
  return async dispatch => {
    try {
      // const res = await nAxios({
      //   method: "get",
      //   url: "/connect/acl"
      // });

      dispatch({
        type: FETCH_APPROVALS,
        payload: [
          {
            uid: "1",
            date: "2021-07-23 09:48 AM",
            requestedBy: "Gunjan Kaushik",
            businessId: "019695325",
            name: "Jai Shree Ram",
            itemChanged: "PROFILE",
            action: "Check Profile"
          },
          {
            uid: "2",
            date: "2021-07-23 09:48 AM",
            requestedBy: "Gunjan Kaushik",
            businessId: "019695325",
            name: "Jai Shree Ram",
            itemChanged: "PROFILE, BANK, OTHER",
            action: "Check Profile"
          },
          {
            uid: "3",
            date: "2021-07-23 09:48 AM",
            requestedBy: "Gunjan Kaushik",
            businessId: "019695325",
            name: "Jai Shree Ram",
            itemChanged: "PROFILE",
            action: "Check Profile"
          },
          {
            uid: "4",
            date: "2021-07-23 09:48 AM",
            requestedBy: "Gunjan Kaushik",
            businessId: "019695325",
            name: "Jai Shree Ram",
            itemChanged: "PROFILE",
            action: "Check Profile"
          },
          {
            uid: "5",
            date: "2021-07-23 09:48 AM",
            requestedBy: "Gunjan Kaushik",
            businessId: "019695325",
            name: "Jai Shree Ram",
            itemChanged: "PROFILE",
            action: "Check Profile"
          }
        ]
      });
    } catch (err) {
      throw err;
    }
  };
};
