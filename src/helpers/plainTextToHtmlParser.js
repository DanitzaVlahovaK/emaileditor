const parseTextToHtml = (inputStr) => {
  let outputHtml = "";

  if (inputStr) {
    let counter;

    const textInput = inputStr.trim();
    if (textInput.length > 0) {
      for (counter = 0; counter < textInput.length; counter += 1) {
        switch (textInput[counter]) {
          case "\n":
            outputHtml += "<br>";
            break;

          case " ":
            if (textInput[counter - 1] !== " " && textInput[counter - 1] !== "\t") outputHtml += " ";
            break;

          case "\t":
            if (textInput[counter - 1] !== "\t") outputHtml += " ";
            break;

          default:
            outputHtml += textInput[counter];
        }
      }
    }
  }

  return outputHtml;
};

export default parseTextToHtml;
