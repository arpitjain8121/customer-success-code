import { FormattedMessage } from "react-intl";

import { isNumeric } from "../../utils";

const establishmentIdSchema = () => ({
  eidNumber: {
    name: "eidNumber",
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      error: (
        <FormattedMessage defaultMessage="Establishment ID entered is incorrect" />
      )
    }
  },
  eidExp: {
    name: "eidExp",
    value: "",
    required: true,
    validator: {
      error: (
        <FormattedMessage defaultMessage="Establishment ID Exp entered is incorrect" />
      )
    }
  }
});

export default establishmentIdSchema;
