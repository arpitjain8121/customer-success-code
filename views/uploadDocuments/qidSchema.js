import { FormattedMessage } from "react-intl";

import { isNumeric } from "../../utils";

const qidSchema = () => ({
  qidNumber: {
    name: "qidNumber",
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      error: <FormattedMessage defaultMessage="QID entered is incorrect" />
    }
  },
  qidExp: {
    name: "qidExp",
    value: "",
    required: true,
    validator: {
      error: <FormattedMessage defaultMessage="QID Exp entered is incorrect" />
    }
  }
});

export default qidSchema;
