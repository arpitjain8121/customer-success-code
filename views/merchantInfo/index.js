import React from "react";
import { useIntl } from "react-intl";
import { useFormValidation } from "../../hooks/useFormValidation";
import MerchantInfoComp from "../../components/merchantInfo";

function useTabProps(schema) {
  const {
    state,
    disable,
    clear,
    handleBlur,
    handleChange,
    updateState
  } = useFormValidation({ ...schema });

  const hasChanged = data => {
    return !equal(pluck(data, ["value"]), pluck(state, ["value"]));
  };

  const formProps = (field = {}) => ({
    type: "text",
    name: field.name,
    value: field.value,
    error: field.error,
    nonEditable: field.nonEditable,
    className: "form-item",
    onBlur: handleBlur,
    onChange: handleChange
  });

  return [state, disable, formProps, clear, hasChanged, updateState];
}

function MerchantInfo() {
  const { formatMessage } = useIntl();

  return <MerchantInfoComp />;
}

export default MerchantInfo;
