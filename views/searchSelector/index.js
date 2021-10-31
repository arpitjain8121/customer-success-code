import React from "react";
import { useDispatch } from "react-redux";
import Select from "react-select/async";

import "./styles.css";

export default function SearchSelector({
  handleSearch,
  className,
  dataApi,
  ...rest
}) {
  const dispatch = useDispatch();

  const loadOptions = q => {
    return dispatch(dataApi(q));
  };

  return (
    <Select
      className={`search-selector ${className || ""}`}
      classNamePrefix="search"
      components={{ IndicatorSeparator: null }}
      onChange={handleSearch}
      loadOptions={loadOptions}
      defaultOptions={true}
      {...rest}
    />
  );
}
