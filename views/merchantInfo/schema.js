import { FormattedMessage } from "react-intl";

import { isEmail, isPhone, isText, isNumeric, isAddress } from "../../utils";

const schema = () => ({
  name: {
    value: "",
    required: true,
    validator: {
      regEx: isText,
      error: <FormattedMessage defaultMessage="Please enter a valid name" />
    }
  },
  phoneNumber: {
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
