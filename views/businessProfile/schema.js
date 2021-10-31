import { FormattedMessage } from "react-intl";

import { isEmail, isPhone, isText, isNumeric, isAddress } from "../../utils";

const schema = () => ({
  organizationName: {
    value: "",
    required: true,
    validator: {
      regEx: isText,
      error: <FormattedMessage defaultMessage="Please enter a valid name" />
    }
  },
  businessPhoneNumber: {
    value: "",
    required: true,
    formatter: " ",
    validator: {
      regEx: isPhone,
      error: (
        <FormattedMessage defaultMessage="Please provide a valid phone number" />
      )
    }
  },
  addressLine1: {
    required: true,
    value: "",
    validator: {
      regEx: isAddress,
      error: (
        <FormattedMessage defaultMessage="Address line 1 must be between 11 to 20 characters long" />
      )
    }
  },
  addressLine2: {
    value: "",
    validator: {
      regEx: isAddress,
      error: (
        <FormattedMessage defaultMessage="Address line 1 must be between 11 to 20 characters long" />
      )
    }
  },
  city: {
    value: "",
    validator: {
      regEx: isText,
      error: <FormattedMessage defaultMessage="Please enter a valid city" />
    }
  },
  postalCode: {
    value: "",
    formatter: "_",
    validator: {
      regEx: isNumeric,
      length: 6,
      error: (
        <FormattedMessage defaultMessage="Please enter 6 digit Numeric postal code" />
      )
    }
  },
  email: {
    value: "",
    required: true,
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Please provide a valid email" />
    }
  },
  ownerFirstName: {
    value: "",
    required: true,
    validator: {
      regEx: isText,
      error: <FormattedMessage defaultMessage="Please enter a valid name" />
    }
  },
  ownerLastName: {
    value: "",
    required: true,
    validator: {
      regEx: isText,
      error: <FormattedMessage defaultMessage="Please enter a valid name" />
    }
  },
  ownerEmail: {
    value: "",
    required: true,
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Please provide a valid email" />
    }
  }
});

export default schema;
