import { FormattedMessage } from "react-intl";

import { isNumeric } from "../../utils";

const tradeLicenceSchema = () => ({
  tlNumber: {
    name: "tlNumber",
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      error: (
        <FormattedMessage defaultMessage="Trade Licence entered is incorrect" />
      )
    }
  },
  tlExp: {
    name: "tlExp",
    value: "",
    required: true,
    validator: {
      error: (
        <FormattedMessage defaultMessage="Trade Licence Exp entered is incorrect" />
      )
    }
  }
});

export default tradeLicenceSchema;
