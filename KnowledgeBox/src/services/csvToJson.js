export const csvToJson = (parsedCsv, delimiter = ',') => {
  //console.log('Lines', parsedCsv);
  let lines = parsedCsv.split(/\r?\n/);

  let headers = lines[0].split(delimiter);

  let jsonResult = [];
  for (let i = 1; i < lines.length; i++) {
    let currentLine = lines[i].split(delimiter);
    if (hasContent(currentLine)) {
      jsonResult.push(buildJsonResult(headers, currentLine));
    }
  }
  return jsonResult;
};

/*export const commaToPipe = (csvObject) => {
  var arrayObject = csvObject.split(/\r?\n/);
  arrayObject.forEach((element, index, Array) => {
    console.log('CommaToPipe:', element);
    if (element.indexOf('"') >= 0) {
      let temp = element.split('"');
      temp[1] = temp[1].split(',').join('~');
      element = temp[0] + temp[1] + temp[2];
    }
    Array[index] = element;
  });
  //console.log(arrayObject.join('\n').split(',').join('|').split('~').join(','));
  return arrayObject.join('\n').split(',').join('|').split('~').join(',');
};*/

export const commaToPipe = (csvObject) => {
  var arrayObject = csvObject.split(/\r?\n/);
  arrayObject.forEach((element, index, Array) => {
    console.log('CommaToPipe:', element);
    let tempElement = '';
    if (element.indexOf('"') >= 0) {
      let temp = element.split('"');
      console.log('TEMP:', temp);
      for (let i = 0; i < temp.length; i++) {
        if (i % 2 == 1) {
          temp[i] = temp[i].split(',').join('~');
        }
      }
      tempElement = temp.join('');
      Array[index] = tempElement;
    }
  });
  //console.log(arrayObject.join('\n').split(',').join('|').split('~').join(','));
  return arrayObject.join('\n').split(',').join('|').split('~').join(',');
};

export const cleanTabs = (rawData) => {
  let temp = rawData.split('"');
  console.log('TEMP:', temp);
  var tempElement = '';
  for (let i = 0; i < temp.length; i++) {
    if (i % 2 == 1) {
      temp[i] = temp[i].replace(/\s{2,}/g, ' ');
      temp[i] = temp[i].replace(/\t/g, ' ');
      temp[i] = temp[i]
        .toString()
        .trim()
        .replace(/(\r\n|\n|\r)/g, '');
    }
  }
  tempElement = temp.join('"');
  return tempElement;
};

const buildJsonResult = (headers, currentLine) => {
  let jsonObject = {};
  for (let j = 0; j < headers.length; j++) {
    let propertyName = trimPropertyName(headers[j]);

    let value = getValueFormatByType(currentLine[j]);

    jsonObject[propertyName] = value;
  }
  return jsonObject;
};

const trimPropertyName = (value) => {
  return value.replace(/\s/g, '');
};

const getValueFormatByType = (value) => {
  let isNumber = !isNaN(value);
  if (isNumber) {
    return Number(value);
  }
  return String(value);
};

const hasContent = (values) => {
  if (values.length > 0) {
    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        return true;
      }
    }
  }
  return false;
};

//export default csvtojson;
//export {csvToJson, commaToPipe};
