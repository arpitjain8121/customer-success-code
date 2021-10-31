import { FormattedMessage } from "react-intl";

import { isAlphaNumeric, isEmail, isPhone } from "../../utils";

const schema = () => ({
  employeeNumber: {
    name: "employeeNumber",
    value: "",
    required: true,
    nonEditable: true
  },
  departmentId: {
    name: "departmentId",
    value: "0",
    required: true
  },
  jobTitle: {
    name: "jobTitle",
    value: ""
  },
  firstName: {
    name: "firstName",
    value: "",
    required: true,
    nonEditable: true
  },
  middleName: {
    name: "middleName",
    value: "",
    nonEditable: true
  },
  lastName: {
    name: "lastName",
    value: "",
    required: true,
    nonEditable: true
  },
  gender: {
    name: "gender",
    value: "0",
    required: true,
    nonEditable: true
  },
  dateOfBirth: {
    name: "dateOfBirth",
    value: "",
    required: true,
    nonEditable: true
  },
  placeOfBirth: {
    name: "placeOfBirth",
    value: "",
    required: true,
    nonEditable: true
  },
  phoneNumber: {
    name: "phoneNumber",
    value: "",
    formatter: " ",
    required: true,
    validator: {
      regEx: isPhone,
      maxLength: 8,
      error: (
        <FormattedMessage defaultMessage="Please provide a valid phone number" />
      )
    }
  },
  email: {
    name: "email",
    value: "",
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Invalid email address" />
    }
  },
  addressLine1: {
    name: "addressLine1",
    value: "",
    required: true,
    validator: {
      regEx: isAlphaNumeric,
      error: <FormattedMessage defaultMessage="No special characters allowed" />
    }
  },
  addressLine2: {
    name: "addressLine2",
    value: "",
    validator: {
      regEx: isAlphaNumeric,
      error: <FormattedMessage defaultMessage="No special characters allowed" />
    }
  },
  city: {
    name: "city",
    value: "",
    required: true
  }
});

export default schema;
