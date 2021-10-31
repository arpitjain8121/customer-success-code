import { useState, useEffect, useCallback } from "react";
import { FormattedMessage } from "react-intl";

export function useFormValidation(schema, callback) {
  const [state, setState] = useState({ ...schema });
  const [disable, setDisable] = useState(true);
  const [err, setErr] = useState({});

  useEffect(() => {
    return () => {
      setState({});
      setErr({});
      setDisable(true);
    };
  }, []);

  const validateState = useCallback(() => {
    const hasError = Object.keys(state).some(key => {
      const { value } = state[key];

      return state[key].required ? !value || err[key] : err[key];
    });

    return hasError;
  }, [state, err]);

  useEffect(() => {
    setDisable(validateState());
  }, [validateState]);

  const handleBlur = ({ target }) => {
    const { name } = target;

    setState(prev => ({
      ...prev,
      [name]: { ...prev[name], error: err[name] }
    }));
  };

  const handleChange = ({ target }) => {
    const { name, value = "" } = target;
    const {
      required,
      formatter,
      validator: { regEx, length, maxLength, minLength, sameAs, error } = {}
    } = state[name];

    let err = "";
    const _value = formatter ? value.split(formatter).join("") : value;

    if (required && !_value) {
      err = (
        <FormattedMessage
          id="form.validation.error"
          defaultMessage="This field is required"
        />
      );
    }

    if (_value) {
      if (regEx && !regEx.test(_value)) {
        err = error;
      }
      if (
        length &&
        (typeof length === "function" ? length(state) : length) !==
          _value.length
      ) {
        err = error;
      }
      if (maxLength && maxLength < _value.length) {
        err = error;
      }
      if (minLength && minLength > _value.length) {
        err = error;
      }
      if (sameAs && state[sameAs].value !== _value) {
        err = error;
      }
    }

    setState(prevState => ({
      ...prevState,
      [name]: { ...prevState[name], value: _value }
    }));

    setErr(prevState => ({
      ...prevState,
      [name]: err
    }));
  };

  const handleSubmit = event => {
    if (event) {
      event.preventDefault();
    }

    if (!validateState() && callback) {
      callback();
      // reset
      // setState(schema);
    }
  };

  const clear = () => {
    setState(schema);
    setDisable(true);
    setErr({});
  };

  const updateState = (data = {}) => {
    const _state = { ...state };

    for (const field in data) {
      if (_state.hasOwnProperty(field)) {
        _state[field].value = data[field];
        _state[field].error = undefined;
      }
    }

    setState(_state);
  };

  return {
    state,
    disable,
    handleBlur,
    handleChange,
    handleSubmit,
    clear,
    updateState
  };
}
