import { FormattedMessage } from "react-intl";

import { isAlphaNumeric } from "../../utils";

const schema = () => ({
  iban: {
    name: "iban",
    value: "",
    formatter: " ",
    validator: {
      regEx: isAlphaNumeric,
      error: <FormattedMessage defaultMessage="IBAN entered is incorrect" />
    }
  },
  confirmIban: {
    name: "confirmIban",
    value: "",
    formatter: " ",
    validator: {
      sameAs: "iban",
      error: <FormattedMessage defaultMessage="IBANs do not match" />
    }
  }
});

export default schema;
