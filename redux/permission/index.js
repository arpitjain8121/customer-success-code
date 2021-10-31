import { FETCH_PERMISSIONS } from "./types";

const accessValues = [16, 8, 4, 2, 1];
const INITIAL_STATE = {};

const CUSTOM_PERMISSIONS = {
  dashboard: 31,
  sAdminApproval: 31,
  kycApproval: 31,
  payouts: 31
};

function parsePermission(value) {
  let _value = value;

  const permission = {};

  accessValues.forEach(level => {
    permission[`${level}`] = _value - level >= 0;

    if (_value - level >= 0) {
      _value -= level;
    }
  });

  return permission;
}

const permission = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_PERMISSIONS: {
      // const { claims, productClaims, products } = payload || {};
      const { claims, productClaims } = payload || {};
      const permissions = {};

      // const productsMap = arrayToObject(products, "id");

      const acl = { ...CUSTOM_PERMISSIONS, ...claims };

      productClaims.forEach(({ permissions, productUid }) => {
        // const productName = productsMap[productUid].name;
        // acl[productName] = 4;

        for (const module in permissions) {
          // acl[`${productName}_${module}`] = permissions[module];
          acl[module] = permissions[module];
        }
      });

      for (const module in acl) {
        if (acl[module]) {
          permissions[module] = parsePermission(acl[module]);
        }
      }

      return { ...state, permissions };
    }
    default: {
      return { ...state };
    }
  }
};

export default permission;
