function decimalToBinary(num) {
    if (num === 0) return "0";
    let intNum = Math.floor(num);
    let dNum = num - intNum;
    let res = "";

    while (intNum > 0) {
        res = (intNum % 2) + res;
        intNum = Math.floor(intNum / 2);
    }
    if (dNum === 0) return res;

    let dres = ".";
    let decLimit = 23;  // Ensuring mantissa precision
    while (dNum > 0 && decLimit > 0) {
        dNum *= 2;
        let bit = Math.floor(dNum);
        dres += bit;
        dNum -= bit;
        decLimit--;
    }
    return res + dres;
}

function valueOfE(binary) {
    let indexOfPoint = binary.indexOf(".");
    let newBinary = binary.replace(".", "");
    let indexOf1 = newBinary.indexOf("1");

    if (indexOf1 === -1) return { exponent: "Invalid", mantissa: "Error" };

    let exponent;
    if (indexOfPoint === -1) { 
        exponent = newBinary.length - 1; 
    } else {
        exponent = indexOfPoint > indexOf1 ? indexOfPoint - indexOf1 - 1 : indexOfPoint - indexOf1;
    }

    let mantissa = newBinary.slice(indexOf1 + 1).padEnd(23, "0").slice(0, 23); // Ensure exactly 23-bit
    return { exponent, mantissa };
}

function decimalTo8BitBinary(num) {
    let binary = (num >>> 0).toString(2);
    return binary.padStart(8, '0');  // Ensure 8-bit representation
}

function normalizeBinary(binary) {
    let indexOf1 = binary.indexOf("1");
    let mantissa = binary.slice(indexOf1 + 1).padEnd(23, "0").slice(0, 23);
    return { normalizedMantissa: mantissa };
}

document.getElementById("result").addEventListener("click", function () {
    let num = parseFloat(document.getElementById("decimalInput").value);
    if (isNaN(num)) {
        alert("Please enter a valid number!");
        return;
    }

    let sign = num < 0 ? 1 : 0;
    num = Math.abs(num);
    let binary = decimalToBinary(num);
    let { exponent, mantissa } = valueOfE(binary);

    let ePrime = exponent + 127;
    let ePrimeBinary = decimalTo8BitBinary(ePrime);

    // Pad mantissa to avoid value change
    let { normalizedMantissa } = normalizeBinary(mantissa);
    let paddedMantissa = normalizedMantissa.padEnd(23, "0");

    document.getElementById("sign").innerText = `S: ${sign}`;
    document.getElementById("bitValue").innerText = `E': ${ePrimeBinary}`;
    document.getElementById("mantisa").innerText = `1.${paddedMantissa}`;
});

