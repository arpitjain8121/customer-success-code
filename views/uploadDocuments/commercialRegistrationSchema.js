import { FormattedMessage } from "react-intl";

import { isNumeric } from "../../utils";

const commercialRegistrationSchema = () => ({
  crNumber: {
    name: "crNumber",
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      error: (
        <FormattedMessage defaultMessage="Commercial Registration entered is incorrect" />
      )
    }
  },
  crExp: {
    name: "crExp",
    value: "",
    required: true,
    validator: {
      error: (
        <FormattedMessage defaultMessage="Commercial Registration Expiry entered is incorrect" />
      )
    }
  }
});

export default commercialRegistrationSchema;
