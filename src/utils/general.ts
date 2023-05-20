import { QueryViewerDataType } from "../common/basic-types";

export function parseNumericPicture(dataType: string, picture: string) {
  // @todo Check if picture can be undefined
  if (picture === "") {
    return {
      DecimalPrecision: dataType === QueryViewerDataType.Integer ? 0 : 2,
      UseThousandsSeparator: false,
      Prefix: "",
      Suffix: ""
    };
  }

  let decimalPrecision;
  let useThousandsSeparator;
  let prefix = "";
  let suffix = "";

  // - - - - - Extract the data from the picture - - - - -
  // It has neither a semicolon nor a comma
  if (picture.indexOf(".") < 0 && picture.indexOf(",") < 0) {
    decimalPrecision = 0;
    useThousandsSeparator = false;
  }
  // Has only point
  else if (picture.indexOf(".") >= 0 && picture.indexOf(",") < 0) {
    decimalPrecision =
      dataType === QueryViewerDataType.Integer
        ? 0
        : picture.length - picture.indexOf(".") - 1;
    useThousandsSeparator = false;
  }
  // Has only comma
  else if (picture.indexOf(".") < 0 && picture.indexOf(",") >= 0) {
    decimalPrecision = 0;
    useThousandsSeparator = true;
  }
  // Has a semicolon
  else {
    decimalPrecision =
      dataType === QueryViewerDataType.Integer
        ? 0
        : picture.length - picture.indexOf(".") - 1;
    useThousandsSeparator = true;
  }

  // - - - - -  Get prefix and suffix - - - - -
  // pictureArea = 1 (prefix), 2 (number) o 3 (suffix)
  let pictureArea = 1;
  for (let i = 0; i < picture.length; i++) {
    const chr = picture.substr(i, 1);
    if (
      (chr === "." || chr === "," || chr === "9" || chr === "Z") &&
      pictureArea === 1
    ) {
      pictureArea = 2;
    }

    if (
      chr !== "." &&
      chr !== "," &&
      chr !== "9" &&
      chr !== "Z" &&
      pictureArea === 2
    ) {
      pictureArea = 3;
    }
    switch (pictureArea) {
      case 1:
        prefix += chr;
        break;
      case 3:
        suffix += chr;
        break;
    }
  }

  return {
    DecimalPrecision: decimalPrecision,
    UseThousandsSeparator: useThousandsSeparator,
    Prefix: prefix,
    Suffix: suffix
  };
}

// function formatNumber(number, decimalPrecision, picture, removeTrailingZeroes) {
//   let formattedNumber = gx.num.formatNumber(
//     number,
//     decimalPrecision,
//     picture,
//     0,
//     true,
//     false
//   );
//   if (removeTrailingZeroes) {
//     if (formattedNumber.indexOf(gx.decimalPoint) >= 0) {
//       while (qv.util.endsWith(formattedNumber, "0")) {
//         formattedNumber = formattedNumber.slice(0, -1);
//       }
//       if (qv.util.endsWith(formattedNumber, gx.decimalPoint)) {
//         formattedNumber = formattedNumber.slice(0, -1);
//       }
//     }
//   }
//   return formattedNumber;
// }

// export function valueOrPercentage(
//   qViewer,
//   valueStr: string,
//   datum: QueryViewerServiceMetaDataDataAxis,
//   decimals: number
// ) {
//   let value;
//   let percentage;
//   if (valueStr != "") {
//     value = qv.util.formatNumber(
//       parseFloat(valueStr),
//       decimals,
//       datum.Picture,
//       false
//     );
//     percentage =
//       qv.util.formatNumber(
//         parseFloat((valueStr * 100) / datum.TargetValue),
//         2,
//         "ZZZZZZZZZZZZZZ9.99",
//         false
//       ) + "%";
//   } else {
//     value = "";
//     percentage = "";
//   }
//   switch (qViewer.ShowDataAs) {
//     case QueryViewerShowDataAs.Values:
//       return value;
//     case QueryViewerShowDataAs.Percentages:
//       return percentage;
//     case QueryViewerShowDataAs.ValuesAndPercentages:
//       return value + " (" + percentage + ")";
//     default:
//       return value;
//   }
// }
