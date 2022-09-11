// Define Return address
const returnName = "Return Solutions LLC"; 
const returnAddress = "1234 Main Street";
const returnCity = "New York";
const returnState = "NY";
const returnZip = "10001";

const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', main);

addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('submit-button').click();
    }
});

function main() {
    const qrInput = document.getElementById('qr-code').value;
    
    // Make sure zpl is valid and copy to clipboard
    try {
        let zplOutput = parse(qrInput);
        if (zplOutput === false) {
            throw new Error('Parsing failed');
        } else {
            navigator.clipboard.writeText(zplOutput);
            alert('Copied to clipboard');
        }
    } catch (error) {}
}

function parse(qrInput) {
    console.log('Scanned code: ' && qrInput);

    // Split QR data
    const qrInputArray = qrInput.split("|");  
    const trackingNumber = qrInputArray[0];
    const referenceID = qrInputArray[1];
    const ecode = qrInputArray[2];
    const shipToName = qrInputArray[3];
    const shipToAddress = qrInputArray[4];
    const shipToSuite = qrInputArray[5];
    const shipToZip = qrInputArray[6];
    const shipToCity = qrInputArray[7];
    const shipToState = qrInputArray[8];

    // Log the parsed data
    console.log('Tracking Number:           ', qrInputArray[0]);
    console.log('Amazon Reference Number:   ', qrInputArray[1]);
    console.log('E code:                    ', qrInputArray[2]);
    console.log('Ship To Name:              ', qrInputArray[3]);
    console.log('Ship To Address:           ', qrInputArray[4]);
    console.log('Suite:                     ', qrInputArray[5]);
    console.log('Ship To ZIP:               ', qrInputArray[6]);
    console.log('Ship To City:              ', qrInputArray[7]);
    console.log('Ship To State:             ', qrInputArray[8]);

    console.log('trackingNumber: ', trackingNumber);
    console.log('trackingNumber.length: ', trackingNumber.length);

    // Verify data against expected length
    try {
        if (Array.isArray(qrInputArray) === false | qrInputArray.length <= 1) {
            addPastScan(qrInput, false);
            throw new Error('Invalid QR code; Scan not valid.');
        } else if (trackingNumber.length !== 18) {
            addPastScan(qrInput, false);
            throw new Error('Invalid QR code; Tracking number is not the correct length');
        } else if (qrInputArray[1].length != 12) {
            addPastScan(qrInput, false);
            throw new Error('Invalid QR code; reference number is not the correct length');
        } else if (qrInputArray[2].length != 2) {
            addPastScan(qrInput, false);
            throw new Error('Invalid QR code; E code is not the correct length');
        } else {
            console.log('Valid QR code');
            addPastScan(qrInput, true);
        }
    } 
        catch (error) {
            console.error(error);
            errorMessage(error);
            return false
        };

    // Format tracking number
    let trackingPartOne = trackingNumber.slice(0, 2);
    let trackingPartTwo = trackingNumber.slice(2, 5);
    let trackingPartThree = trackingNumber.slice(5, 8);
    let trackingPartFour = trackingNumber.slice(8, 10);
    let trackingPartFive = trackingNumber.slice(10, 14);
    let trackingPartSix = trackingNumber.slice(14, 18);
    const trackingNumberReadbale = `${trackingPartOne} ${trackingPartTwo} ${trackingPartThree} ${trackingPartFour} ${trackingPartFive} ${trackingPartSix}`;
    console.log("Tracking Number Readable: ", trackingNumberReadbale);
  
    //   Build the ZPL output
    let zpl = `
    ^XA 
    ^FX Return Address
    ^FO30,30^A0,25^FD${returnName}^FS
    ^FO30,60^A0,25^FD${returnAddress}^FS
    ^FO30,90^A0,25^FD${returnCity}, ${returnState} ${returnZip}^FS

    ^FX Quantity
    ^FO700,30^A0,30^FD1 of 1^FS

    ^FX Ship to
    ^FO40,160^A0,30^FDSHIP^FS
    ^FO60,190^A0,30^FDTO:^FS
    ^FX Name
    ^FO120,160^A0,70^FDAMAZON RETURNS^FS

    ^FX Separator
    ^FO30,300^GB740,3,3^FS

    ^FX Set barbode width
    ^BY3

    ^FX Centered code 128 barcode for tracking number
    ^FO50,720^BCN,125^FD${trackingNumber}^FS

    ^FX Centered code 128 barcode for reference number
    ^FO100,1070^BCN,75,Y,Y^FD${referenceID}^FS

    ^FX Amazon QR Code
    ^FO30,305^A0,25^FDAmazon QR Code^FS
    ^FO30,325^BQN,2,4,A^FDMA,${qrInput}^FS

    ^FX Tracking Number QR Code
    ^FO400,305^A0,25^FDTracking Number QR Code^FS
    ^FO400,330^BQN,2,4,A^FDQA,${trackingNumber}^FS

    ^FX Thick Separator
    ^FO30,600^GB740,5,5^FS

    ^FX UPS Ground and printed tracking number
    ^FO30,620^A0,30^FDUPS Ground^FS
    ^FO30,660^A0,25^FDTracking #:^FS
    ^FO150,660^AE,25^FD${trackingNumberReadbale}^FS

    ^FX Thin Separator
    ^FO30,700^GB740,2,1^FS

    ^FX Box between thick and thin separators
    ^FO670,600^GB100,100,100^FS

    ^FX Thick bottom separator
    ^FO30,880^GB740,5,5^FS

    ^FX Return info
    ^FO30,890^A0,30^FDBILLING: P/P^FS
    ^FO30,920^A0,30^FDDESC: RETURNED MERCHANDISE^FS
    ^FO30,950^A0,30^FDRETURN SERVICE^FS
    ^FO30,980^A0,30^FDREFERENCE NO:^FS

    ^FX Reference number
    ^FO240,980^AE^FD${referenceID.slice(0,6)} ${referenceID.slice(6,12)}^FS

    ^FX Thin bottom separator
    ^FO30,1020^GB740,2,1^FS

    ^FX E code
    ^FO660,1090^A0,50^FD${ecode}^FS

    ^XZ`
    console.log(zpl);

    return zpl;
}

// Function to add past scans to a table
let rowNumber = 1;
function addPastScan(input, isValid) {
    const table = document.getElementById('pastScans');
    const row = table.insertRow(1);
    const scanCell = row.insertCell(0);
    const copyCell = row.insertCell(1);
    const copyButton = `<button class='copy' id='copyRow${rowNumber}' onclick='navigator.clipboard.writeText(document.getElementById("row${rowNumber}").getElementsByTagName("td")[0].innerHTML);'>Copy</button>`;
    copyCell.innerHTML = copyButton;
    if (isValid === true) {
        row.id = `row${rowNumber}`;
        scanCell.innerHTML = input;
    }
    // make tr background red if invalid
    else {
        row.id = `row${rowNumber}`;
        row.style.backgroundColor = 'red';
        scanCell.innerHTML = input;
    }
    // clear the input field
    document.getElementById('qr-code').value = '';
    rowNumber++;
    console.log('Next rowNumber: ', rowNumber);
}

function errorMessage(error) {
    const errorDiv = document.getElementById('err');
    // Display error message for 5 seconds
    errorDiv.innerHTML = error;
    errorDiv.style.backgroundColor = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.fontFamily = 'Arial, Helvetica, sans-serif';
    errorDiv.style.fontSize = '1.5rem';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.margin = 'auto';
    errorDiv.style.width = '80%';
    setTimeout(() => {
        errorDiv.innerHTML = '';
        errorDiv.style.backgroundColor = '';
    }, 5000);
}