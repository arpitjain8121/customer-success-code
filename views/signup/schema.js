import { FormattedMessage } from "react-intl";

import { isEmail, isNumeric, isPassword, isPhone, isText } from "../../utils";

const schema = {
  businessName: {
    value: "",
    required: true,
    validator: {
      regEx: isText,
      error: <FormattedMessage defaultMessage="Please enter a valid name" />
    }
  },
  email: {
    value: "",
    required: true,
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Invalid email address" />
    }
  },
  establishmentID: {
    value: "",
    required: true,
    validator: {
      regEx: isNumeric,
      length: 11,
      error: <FormattedMessage defaultMessage="Invalid establishment id" />
    }
  },
  phoneNumber: {
    value: "",
    required: true,
    formatter: " ",
    validator: {
      regEx: isPhone,
      maxLength: 8,
      error: (
        <FormattedMessage defaultMessage="Please provide a valid phone number" />
      )
    }
  },
  createPassword: {
    value: "",
    required: true,
    validator: {
      regEx: isPassword,
      error: (
        <FormattedMessage defaultMessage="Password must have at least 8 characters" />
      )
    }
  },
  confirmPassword: {
    value: "",
    required: true,
    validator: {
      sameAs: "createPassword",
      error: <FormattedMessage defaultMessage="Passwords do not match" />
    }
  }
};

export default schema;
