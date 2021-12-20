function isJsonString(jsonString) {
    try {
        if (typeof JSON.parse(jsonString) == "object") return true;
    } catch (e) {
        return false; // It's not a valid JSON format
    }
    return false;
}

function searchJSONStrings(urlParams) {
    let listOfAllJSONParameters = [];
    for (var paramName of urlParams.keys()) {
        paramValue = urlParams.get(paramName);
        if (isJsonString(paramValue)) {
            listOfAllJSONParameters.push(paramName);
        }
    }

    return listOfAllJSONParameters;
}

function searchArrayOfObjects(urlParams) {
    let listOfAllURLParameters = [];
    for (var paramName of urlParams.keys()) {
        listOfAllURLParameters.push(paramName);
    }
    let listOfAllURLParametersWithoutDuplicates = [...new Set(listOfAllURLParameters)];
    let listOfAllURLParametersDuplicates = [...listOfAllURLParameters];
    listOfAllURLParametersWithoutDuplicates.forEach((item) => {
        const i = listOfAllURLParametersDuplicates.indexOf(item)
        listOfAllURLParametersDuplicates = listOfAllURLParametersDuplicates
            .slice(0, i)
            .concat(listOfAllURLParametersDuplicates.slice(i + 1, listOfAllURLParametersDuplicates.length))
    });

    return listOfAllURLParametersDuplicates;
}

function serializeQuery(params, prefix) {
    const query = Object.keys(params).map((key) => {
        const value = params[key];

        if (params.constructor === Array)
            key = `${prefix}[${key}]`; // key = `${prefix}[]`; todo: need check
        else if (params.constructor === Object)
            key = (prefix ? `${prefix}[${key}]` : key);

        if (typeof value === 'object')
            return serializeQuery(value, key);
        else
            return `${key}=${encodeURIComponent(value)}`;
    });

    return [].concat.apply([], query).join('&');
}

function placeholderCustom(input, placeholder) {
    !input.value ? input.value = placeholder : ""

    input.addEventListener("focus", () => {
        input.value === placeholder ? input.value = "" : placeholder
    })

    input.addEventListener("blur", () => {
        input.value === "" ? input.value = placeholder : ""
    })

    input.addEventListener("input", () => {
        input.value === placeholder ? input.value = "" : ""
    })
}

function searchParametersWhichNeedPrepare(urlParams) {
    listOfAllJSONParameters = searchJSONStrings(urlParams);
    listOfAllURLParametersDuplicates = searchArrayOfObjects(urlParams);

    // merge two above initialized arrays
    return listOfAllJSONParameters.map(item1 => {
        return Object.assign(item1, listOfAllURLParametersDuplicates.find(item2 => {
            return item1.text === item2.text
        }))
    });
}

function prepareRequestUrlInvalidParametersToValidParameters(requestUrl) {
    let url = new URL(requestUrl);
    let urlParams = new URLSearchParams(url.search);
    let parametersWhichNeedPrepare = searchParametersWhichNeedPrepare(urlParams);

    parametersWhichNeedPrepare.forEach((paramName) => {
        let paramsJsonArray = [];
        urlParams.getAll(paramName).forEach((paramValue, paramName) => {
            paramValueDecoded = decodeURIComponent(paramValue);
            paramValueJsonObject = JSON.parse(paramValueDecoded);
            paramsJsonArray.push(paramValueJsonObject);
        });

        let paramsJsonObject = new Object();
        paramsJsonObject[paramName] = paramsJsonArray;

        preparedParams = serializeQuery(paramsJsonObject);

        urlParams.delete(paramName);
        urlParams = new URLSearchParams(urlParams.toString() + '&' + preparedParams);
    });

    url.search = urlParams;

    return url.toString();
}