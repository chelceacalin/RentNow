export const handleInputChangeWithValidation = (
  e,
  setFieldFn,
  setErrorFn,
  validateFn,
  message,
  delay
) => {
  const value = e.target.value;
  setFieldFn(value);
  if (validateFn(value)) {
    setTimeout(() => {
      setErrorFn(message);
    }, delay ?? 1000);
  } else {
    setErrorFn("");
  }
};

export const startsWithUppercase = (value) =>
  value && value.charAt(0) !== value.charAt(0).toUpperCase();

export const resetField = (setterFn, value) => {
  setterFn(value);
};
