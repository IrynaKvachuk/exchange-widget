let exchangeDate = document.getElementById("date");
let inputCurrencyCC = document.getElementById("inputCurrency");
let outputCurrencyCC = document.getElementById("outputCurrency");
let btnConvert = document.getElementById("submitExchangeBtn");
let btnSwapCurrencies = document.getElementById("arrowBtn");
let currencyConverter = document.getElementById("currencyConverter");
let btnConverterOpen = document.getElementById("btnConverterOpen");
let btnConverterClose = document.getElementById("btnCoverterClose");
let inputAmount = document.getElementById("inputAmount");
let outputAmount = document.getElementById("outputAmount");
let errorMes = document.getElementById("error");
const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
let storage = [];

fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        storage = data;
        getDate(storage);
        initSelect(storage);
    })
    .catch(err => {
        console.error('Error: ', err);
    })

let getDate = (storage) => {
    exchangeDate.innerText = storage[0].exchangedate;
}

let appendCurrency = (abb, fullName, input) => {
    let option = document.createElement('option');
    option.innerText = abb + " - " + fullName;
    input.appendChild(option);
}

let initSelect = (data) => {
    appendCurrency("UAH", "Українська гривня", inputCurrencyCC);
    appendCurrency("UAH", "Українська гривня", outputCurrencyCC);
    for (let i = 0; i < data.length; i++) {
        let currency = data[i];
        appendCurrency(currency.cc, currency.txt, inputCurrencyCC);
        appendCurrency(currency.cc, currency.txt, outputCurrencyCC);
    }

}

let getCurrency = (currency) => {
    errorMes.style.display = "none";
    if (inputAmount.value == "") {
        inputAmount.placeholder = "Please, type amount here..";
        inputAmount.classList.add('noAmount');
        return false;
    }
    let isNumber = /^[0-9]{1,12}(\.[0-9]+)?$/;
    if (inputAmount.value.match(isNumber)) {
        let inputCurrencyValue = inputCurrencyCC.options[inputCurrencyCC.selectedIndex].text;
        let outputCurrencyValue = outputCurrencyCC.options[outputCurrencyCC.selectedIndex].text;
        let inputCurrency = findElement(currency, inputCurrencyValue);
        let outputCurrency = findElement(currency, outputCurrencyValue);
        outputAmount.value = convertCurrency(inputAmount.value, inputCurrencyValue, outputCurrencyValue, inputCurrency, outputCurrency);
    } else {
        errorMes.style.display = "block";
    }
}

let findElement = (array, element) => {
    for (let i = 0; i < array.length; i++) {
        if (element.substr(0, 3) == array[i].cc) {
            return array[i];
        }
    }
}

let convertCurrency = (amount, inputCurrencyValue, outputCurrencyValue, inputCurrency, outputCurrency) => {
    let inputCur = inputCurrencyValue.substr(0, 3);
    let outputCur = outputCurrencyValue.substr(0, 3);
    if (inputCur == outputCur) {
        return amount;
    }
    if (inputCur == "UAH") {
        return (amount * outputCurrency.rate).toLocaleString('en-US');
    }
    if (outputCur == "UAH") {
        return (amount / inputCurrency.rate).toLocaleString('en-US');
    }
    return (((amount * inputCurrency.rate) / outputCurrency.rate).toLocaleString('en-US'));
}


let swapCurrencies = () => {
    btnSwapCurrencies.classList.toggle("swapCurrencies");
    let inputIndex = inputCurrencyCC.selectedIndex;
    let outputIndex = outputCurrencyCC.selectedIndex;
    inputCurrencyCC.options.selectedIndex = outputIndex;
    outputCurrencyCC.options.selectedIndex = inputIndex;
    outputAmount.value = "";
}

btnConvert.onclick = () => getCurrency(storage);
btnSwapCurrencies.onclick = swapCurrencies;
btnConverterClose.onclick = () => {
    currencyConverter.style.display = "none";
    btnConverterOpen.style.display = "block"
}
btnConverterOpen.onclick = () => {
    currencyConverter.style.display = "flex";
    btnConverterOpen.style.display = "none"
}
inputAmount.onclick = () => {
    if (inputAmount.classList.contains('noAmount')) {
        inputAmount.classList.remove('noAmount');
        inputAmount.placeholder = "";
    }
}