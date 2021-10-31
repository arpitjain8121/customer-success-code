import { FormattedMessage } from "react-intl";

import { isNumeric } from "../../utils";

const schema = () => ({
  nationality: {
    name: "nationality",
    value: "0"
  },
  passportNumber: {
    name: "passportNumber",
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      length: 12,
      error: (
        <FormattedMessage defaultMessage="Please provide a valid passport number" />
      )
    }
  },
  passportExpiry: {
    name: "passportExpiry",
    value: "",
    required: true
  },
  documentTypeId: {
    name: "documentTypeId",
    value: "0"
  },
  documentNumber: {
    name: "documentNumber",
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      length: fields =>
        Number(fields["documentTypeId"].value) === 5 ? 11 : 12, // qatar id length 11, rest are 12
      error: <FormattedMessage defaultMessage="Please provide a valid id" />
    }
  },
  documentExpiry: {
    name: "documentExpiry",
    value: "",
    required: true
  }
});

export default schema;
