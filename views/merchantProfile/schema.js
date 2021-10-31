import { FormattedMessage } from "react-intl";

import { isAlphabet, isAlphaNumeric, isEmail, isNumeric } from "../../utils";

const schema = () => ({
  businessName: {
    name: "businessName",
    label: <FormattedMessage defaultMessage="Name" />,
    value: "",
    required: true
  },
  registeredEmailId: {
    value: "",
    name: "registeredEmailId",
    label: <FormattedMessage defaultMessage="Email ID" />,
    required: true,
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Invalid email address" />
    }
  },
  phoneNumber: {
    value: "",
    name: "phoneNumber",
    label: <FormattedMessage defaultMessage="Phone Number" />,
    required: true,
    formatter: " ",
    validator: {
      regEx: isNumeric,
      error: <FormattedMessage defaultMessage="Invalid phone number" />
    }
  },
  additionalMobileNumber: {
    value: "",
    name: "additionalMobileNumber",
    label: <FormattedMessage defaultMessage="Additional Phone Number" />,
    formatter: " ",
    validator: {
      regEx: isNumeric,
      error: <FormattedMessage defaultMessage="Invalid phone number" />
    }
  },
  streetAddress: {
    value: "",
    name: "streetAddress",
    required: true,
    label: <FormattedMessage defaultMessage="Street Address" />
  },
  pinCode: {
    value: "",
    name: "pinCode",
    label: <FormattedMessage defaultMessage="Pincode" />,
    required: true,
    validator: {
      regEx: isNumeric,
      length: 6
    }
  },
  city: {
    value: "",
    name: "city",
    label: <FormattedMessage defaultMessage="City" />,
    required: true,
    validator: {
      regEx: isAlphabet
    }
  },
  cityId: {
    value: "",
    name: "cityId",
    label: <FormattedMessage defaultMessage="City Id" />
  },
  stateId: {
    value: "",
    name: "stateId",
    label: <FormattedMessage defaultMessage="State Id" />
  },
  state: {
    value: "",
    name: "state",
    label: <FormattedMessage defaultMessage="State" />,
    required: true,
    validator: {
      regEx: isAlphabet
    }
  },
  bankName: {
    value: "",
    name: "bankName",
    label: <FormattedMessage defaultMessage="Bank Name" />,
    required: true,
    validator: {
      regEx: isAlphabet
    }
  },
  branchId: {
    value: "",
    name: "branchId",
    label: <FormattedMessage defaultMessage="Branch Id" />
  },
  branchName: {
    value: "",
    name: "branchName",
    label: <FormattedMessage defaultMessage="Branch Name" />,
    required: true,
    validator: {
      regEx: isAlphabet
    }
  },
  branchAddress: {
    value: "",
    name: "branchAddress",
    label: <FormattedMessage defaultMessage="Branch Address" />,
    required: true,
    validator: {
      regEx: isAlphabet
    }
  },
  accountNumber: {
    value: "",
    name: "accountNumber",
    label: <FormattedMessage defaultMessage="Bank Account Number" />,
    required: true,
    validator: {
      regEx: isNumeric,
      minLength: 9,
      maxLength: 18
    }
  },
  nameAsInBankAccount: {
    value: "",
    name: "nameAsInBankAccount",
    label: <FormattedMessage defaultMessage="Name as in Bank Account" />,
    required: true,
    validator: {
      regEx: isAlphabet
    }
  },
  ifsc: {
    value: "",
    name: "ifsc",
    label: <FormattedMessage defaultMessage="IFSC" />,
    required: true
  },
  swiftCode: {
    value: "",
    name: "swiftCode",
    label: <FormattedMessage defaultMessage="SWIFT Code" />,
    validator: {
      regEx: isAlphaNumeric,
      length: 11
    }
  },
  firstName: {
    value: "",
    name: "firstName",
    label: <FormattedMessage defaultMessage="First Name" />,
    required: true
  },
  lastName: {
    value: "",
    name: "lastName",
    label: <FormattedMessage defaultMessage="Last Name" />,
    required: true
  },
  ownerPhoneNumber: {
    value: "",
    name: "ownerPhoneNumber",
    label: <FormattedMessage defaultMessage="Phone Number" />,
    required: true,
    formatter: " ",
    validator: {
      regEx: isNumeric,
      error: <FormattedMessage defaultMessage="Invalid phone number" />
    }
  },
  ownerEmail: {
    value: "",
    name: "ownerEmail",
    label: <FormattedMessage defaultMessage="Email ID" />,
    validator: {
      regEx: isEmail,
      error: <FormattedMessage defaultMessage="Invalid email id" />
    }
  },
  partner: {
    value: "",
    name: "partner",
    label: <FormattedMessage defaultMessage="Partner" />
  },
  riskLevel: {
    value: "",
    name: "riskLevel",
    label: <FormattedMessage defaultMessage="Risk Level" />,
    required: true
  },
  vertical: {
    value: "",
    name: "vertical",
    label: <FormattedMessage defaultMessage="Vertical" />,
    required: true
  },
  productCategory: {
    value: "",
    name: "productCategory",
    label: <FormattedMessage defaultMessage="Product Category" />,
    required: true,
    validator: {
      regEx: isAlphaNumeric,
      error: <FormattedMessage defaultMessage="Only letters allowed" />
    }
  },
  acqNumber: {
    value: "",
    name: "acqNumber",
    label: <FormattedMessage defaultMessage="ACQ Number" />,
    required: true,
    validator: {
      regEx: isNumeric,
      error: <FormattedMessage defaultMessage="Only numbers allowed" />
    }
  }
});

export default schema;
