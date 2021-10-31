import { FormattedMessage } from "react-intl";

import { isAlphaNumeric, isNumeric, isText } from "../../utils";

const bankDetailsSchema = () => ({
  bankName: {
    name: "bankName",
    value: "",
    required: true,
    validator: {
      regEx: isAlphaNumeric
    }
  },
  iban: {
    name: "iban",
    value: "",
    formatter: " ",
    required: true,
    validator: {
      regEx: isAlphaNumeric,
      error: <FormattedMessage defaultMessage="IBAN entered is incorrect" />
    }
  },
  confirmIban: {
    name: "confirmIban",
    value: "",
    formatter: " ",
    required: true,
    validator: {
      sameAs: "iban",
      error: <FormattedMessage defaultMessage="IBANs do not match" />
    }
  },
  accountNumber: {
    name: "accountNumber",
    value: "",
    formatter: " ",
    required: true,
    validator: {
      regEx: isNumeric,
      error: (
        <FormattedMessage defaultMessage="Account Number entered is incorrect" />
      )
    }
  },
  confirmAccountNumber: {
    name: "confirmAccountNumber",
    value: "",
    formatter: " ",
    required: true,
    validator: {
      sameAs: "accountNumber",
      error: <FormattedMessage defaultMessage="Accont Numbers do not match" />
    }
  }
});

export default bankDetailsSchema;
