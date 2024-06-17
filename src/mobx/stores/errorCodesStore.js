import i18n from "i18next";

class ErrorCodesStore {
  errors = [
    {
      code: "SCLAPI-1",
      message: i18n.t("ErrorCodesMessages.LocationNameNotFound"),
    },
    {
      code: "SCLAPI-2",
      message: i18n.t("ErrorCodesMessages.ClientPathWrong"),
    },
  ];
}

export default ErrorCodesStore;
