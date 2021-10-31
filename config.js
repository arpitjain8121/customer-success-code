const config = () => {
  const CONFIGS = {
    COUNTRY: "INDIA",
    PROJECT_NAME: "Indipaisa",
    COUNTRY_CODE: "+91",
    PHONE_NUMBER_LENGTH: 10,
    COUNTRY_CODE_FORMAT: "9999 999 999",
    CURRENCY: "INR"
  };

  process.config = {
    ...process.env,
    ...CONFIGS
  };
};

export default config;
