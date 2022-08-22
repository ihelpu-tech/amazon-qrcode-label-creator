// Return address
const returnName = "Meinhart Solutions LLC"; 
const returnAddress = "800 S Henrietta St";
const returnCity = "Effingham";
const returnState = "IL";
const returnZip = "62401";

function main() {
    const qrInput = document.getElementById('qr-code').value;
    console.log("Scanned code: " && qrInput);

    // Copy to clipboard
    let zplOutput = parse(qrInput);
    navigator.clipboard.writeText(zplOutput);
    alert("Copied to clipboard");

    // clear the input field
    document.getElementById('qr-code').value = "";
}

// Listen for enter key
addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submit-button").click();
    }
});

function parse(qrInput) {
  const qrInputArray = qrInput.split("|");
//   Ship To address
  const trackingNumber = qrInputArray[0];
  const referenceID = qrInputArray[1];
  const ecode = qrInputArray[2];
  const shipToName = qrInputArray[3];
  const shipToAddress = qrInputArray[4];
  const shipToSuite = qrInputArray[5];
  const shipToZip = qrInputArray[6];
  const shipToCity = qrInputArray[7];
  const shipToState = qrInputArray[8];

// Format tracking number
  let trackingPartOne = trackingNumber.slice(0, 2);
  let trackingPartTwo = trackingNumber.slice(2, 5);
  let trackingPartThree = trackingNumber.slice(5, 8);
  let trackingPartFour = trackingNumber.slice(8, 10);
  let trackingPartFive = trackingNumber.slice(10, 14);
  let trackingPartSix = trackingNumber.slice(14, 18);
  const trackingNumberReadbale = `${trackingPartOne} ${trackingPartTwo} ${trackingPartThree} ${trackingPartFour} ${trackingPartFive} ${trackingPartSix}`;
  console.log("Tracking Number Readable: ", trackingNumberReadbale);

//   Log the parsed data
  console.log(parse.qrInputArray);
  console.log("Tracking Number: ", parse.trackingNumber);
  console.log("Amazon Reference Number: ", referenceID);
  console.log("E code: ", ecode);
  console.log("Ship To Name: ", shipToName);
  console.log("Ship To Address: ", shipToAddress);
  console.log("Suite: ", shipToSuite);
  console.log("Ship To ZIP: ", shipToZip);
  console.log("Ship To City: ", shipToCity);
  console.log("Ship To State: ", shipToState);
  
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
  ^FO120,160^A0,30^FD${shipToName}^FS
  ^FX Street Address
  ^FO120,190^A0,30^FD${shipToAddress}^FS
  ^FX Suite
  ^FO120,220^A0,30^FD${shipToSuite}^FS
  
  ^FX City, State, Zip
  ^FO120,250^A0,30^FD${shipToCity}, ${shipToState} ${shipToZip}^FS

  ^FX Separator
  ^FO30,300^GB740,3,3^FS

  ^FX Set barbode width
  ^BY3

  ^FX Centered code 128 barcode for tracking number
  ^FO50,720^BCN,125^FD${trackingNumber}^FS

  ^FX Centered code 128 barcode for reference number
  ^FO100,1070^BCN,75,Y,Y^FD${referenceID}^FS

  ^FX Amazon QR Code
  ^FO30,305^A0,16^FDAmazon QR Code^FS
  ^FO30,320^BQN,2,4,A^FDMA,${qrInput}^FS

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

};

