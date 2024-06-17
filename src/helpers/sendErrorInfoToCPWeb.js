import Cookies from "js-cookie";

const sendErrorInfoToCPWeb = (error) => {
  const errorInputCP = document.querySelectorAll(
    '[data-retweb="errorText"]'
  )[0];

  if (errorInputCP !== undefined) {
    errorInputCP.value = `ERROR: ${error};
     Cookies: ${JSON.stringify(Cookies.get())}`;
    const errorBtnCP = document.querySelectorAll(
      '[data-retweb="errorButton"]'
    )[0];

    if (errorBtnCP !== undefined) {
      errorBtnCP.click();
    }
  }
};

export default sendErrorInfoToCPWeb;
