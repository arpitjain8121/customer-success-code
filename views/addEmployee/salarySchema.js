import { FormattedMessage } from "react-intl";

import { isCurrency } from "../../utils";

const schema = () => ({
  basicSalary: {
    name: "basicSalary",
    value: "",
    required: true,
    validator: {
      regEx: isCurrency,
      error: <FormattedMessage defaultMessage="Basic salary must be a number" />
    }
  },
  foodAllowance: {
    name: "foodAllowance",
    value: "",
    validator: {
      regEx: isCurrency,
      error: (
        <FormattedMessage defaultMessage="Food allowance must be a number" />
      )
    }
  },
  accommodation: {
    name: "accommodation",
    value: "",
    validator: {
      regEx: isCurrency,
      error: (
        <FormattedMessage defaultMessage="Accommodation allowance must be a number" />
      )
    }
  },
  standardRate: {
    name: "standardRate",
    value: "",
    validator: {
      regEx: isCurrency,
      error: (
        <FormattedMessage defaultMessage="Standard rate must be a number" />
      )
    }
  },
  overTimeRate: {
    name: "overTimeRate",
    value: "",
    validator: {
      regEx: isCurrency,
      error: (
        <FormattedMessage defaultMessage="Overtime Rate must be a number" />
      )
    }
  },
  holidayRate: {
    name: "holidayRate",
    value: "",
    validator: {
      regEx: isCurrency,
      error: (
        <FormattedMessage defaultMessage="Holiday hour rate must be a number" />
      )
    }
  }
});

export default schema;
