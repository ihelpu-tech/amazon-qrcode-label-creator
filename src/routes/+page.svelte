<script lang="ts">
	// import { onMount } from 'svelte';		// TO-DO - figure out how to store previous scans
	// import { Button, Container, Stack, SvelteUIProvider } from '@svelteuidev/core';
	import { jsPDF } from 'jspdf';
	import qrcode from 'qrcode';
	import JsBarcode from 'jsbarcode';
	// import { select_option } from 'svelte/internal';

	let qrInput: string = '';
	let previousScans: string[] = [];
	let scanNumber: number = 0;

	let returnName: string;
	let returnAddress: string;
	let returnSuite: string;
	let returnCity: string;
	let returnState: string;
	let returnZip: string;
	let savePreviousReturn: boolean = false;
	let copyTrackingNumber: boolean = true;
	let autoPrint: boolean = true;

	let showBanner: boolean = false;
	let bannerMessage: string = '';
	type bannerColor = '' | 'red' | 'green' | 'darkorange';
	let bannerColor: bannerColor = '';

	function createBarcode(barcodeInputText: string) {
		const barcodeOptions: Object = {
			format: 'CODE128',
			displayValue: false,
			background: '#ffffff',
			lineColor: '#000000',
			margin: 0,
			width: 5,
			height: 35
		};

		// Use JSBarcode to create the barcode
		let canvas = document.createElement('canvas');
		JsBarcode(canvas, barcodeInputText, barcodeOptions);

		const BarcodeImgData: string = canvas.toDataURL('image/png');

		// Return the barcode image data
		return BarcodeImgData;
	}

	// TODO: Create a working QR code generator function

	function createTheLabel() {
		console.log('Starting new label creation');
		// trim the input
		qrInput = qrInput.trim();

		// Log the value of the QR code
		console.log(qrInput);

		// Save the value of the QR code to an array in local storage
		previousScans = [qrInput, ...previousScans];

		// Split QR data
		let qrInputArray = qrInput.split('|');
		let trackingNumber = qrInputArray[0];
		let referenceID = qrInputArray[1];
		let ecode = qrInputArray[2];
		let returnQuantity = qrInputArray[16];
		let returnItem = qrInputArray[17];
		let shipToName = qrInputArray[3];
		let shipToAddress = qrInputArray[4];
		let shipToSuite = qrInputArray[5];
		let shipToZip = qrInputArray[6];
		let shipToCity = qrInputArray[7];
		let shipToState = qrInputArray[8];

		// Log the parsed data
		console.log('Tracking Number:           ', qrInputArray[0]);
		console.log('Amazon Reference Number:   ', qrInputArray[1]);
		console.log('E code:                    ', qrInputArray[2]);
		console.log('Return Quantity:           ', qrInputArray[16]);
		console.log('Return Item:               ', qrInputArray[17]);
		console.log('Ship To Name:              ', qrInputArray[3]);
		console.log('Ship To Address:           ', qrInputArray[4]);
		console.log('Suite:                     ', qrInputArray[5]);
		console.log('Ship To ZIP:               ', qrInputArray[6]);
		console.log('Ship To City:              ', qrInputArray[7]);
		console.log('Ship To State:             ', qrInputArray[8]);

		console.log('trackingNumber: ', trackingNumber);
		console.log('trackingNumber.length: ', trackingNumber.length);

		// Verify input data
		try {
			if (Array.isArray(qrInputArray) === false || qrInputArray.length <= 1) {
				throw new Error('Invalid QR code; Scan not valid.');
			} else if (trackingNumber.length !== 18) {
				throw new Error('Invalid QR code; Tracking number is not the correct length');
			} else if (qrInputArray[1].length != 12) {
				throw new Error('Invalid QR code; reference number is not the correct length');
			} else if (returnName === undefined || returnName === '') {
				throw new Error('Please enter your name');
			} else if (returnAddress === undefined || returnAddress === '') {
				throw new Error('Please enter your address');
			} else if (returnCity === undefined || returnCity === '') {
				throw new Error('Please enter your city');
			} else if (returnState === undefined || returnState === '') {
				throw new Error('Please enter your state');
			} else if (returnZip === undefined || returnZip === '') {
				throw new Error('Please enter your zip code');
			} else {
				console.log('Valid QR code');
			}
		} catch (error: any) {
			clearInput();
			errorMessage(error);
			return false;
		}

		// Combine return city, state, and zip
		let returnCityStateZip: string = `${returnCity}, ${returnState} ${returnZip}`;

		// Format tracking number
		let trackingPartOne: string = trackingNumber.slice(0, 2);
		let trackingPartTwo: string = trackingNumber.slice(2, 5);
		let trackingPartThree: string = trackingNumber.slice(5, 8);
		let trackingPartFour: string = trackingNumber.slice(8, 10);
		let trackingPartFive: string = trackingNumber.slice(10, 14);
		let trackingPartSix: string = trackingNumber.slice(14, 18);
		const trackingNumberReadbale: string = `${trackingPartOne} ${trackingPartTwo} ${trackingPartThree} ${trackingPartFour} ${trackingPartFive} ${trackingPartSix}`;
		console.log('Tracking Number Readable: ', trackingNumberReadbale);

		// Split the reference number
		let referencePartOne = referenceID.slice(0, 5);
		let referencePartTwo = referenceID.slice(5, 12);
		const referenceNumberReadable = `${referencePartOne} ${referencePartTwo}`;

		// Create a new PDF document
		const doc: any = new jsPDF({
			orientation: 'portrait',
			unit: 'in',
			format: [4, 6]
		});

		// Set default font
		doc.setFont('helvetica');

		// // Add the barcode font
		// doc.addFont('src/fonts/LibreBarcode128-Regular.ttf', 'LibreBarcode128-Regular', 'normal');

		// Return Address
		doc.setFontSize(8);
		doc.text(0.1, 0.2, returnName.toUpperCase());
		doc.text(0.1, 0.32, returnAddress.toUpperCase());
		doc.text(0.1, 0.44, returnCityStateZip.toUpperCase());

		// Quantity
		doc.text(3.5, 0.2, '1 OF 1');

		// Ship to Address
		doc.setFontSize(12);
		doc.text(0.1, 0.75, 'SHIP');
		doc.text(0.1, 0.9, 'TO:');
		doc.setFontSize(16);
		doc.text(0.7, 0.8, 'AMAZON RETURNS');

		doc.setLineWidth(0.02);
		doc.line(0, 1, 4, 1);

		doc.setLineWidth(0.05);

		// QR Codes
		doc.setFontSize(8);
		doc.text(0.1, 1.15, 'Amazon QR Code');
		doc.text(2.5, 1.15, 'Tracking No QR Code');

		const qrOptions: Object = {
			errorCorrectionLevel: 'H',
			margin: 1,
			color: {
				dark: '#000000ff',
				light: '#ffffffff'
			}
		};
		qrcode.toCanvas(qrInput, qrOptions, function (error, canvas1) {
			if (error) console.error(error);
			console.log('Generating QR code...');
			const amazonOriginalScanImgData = canvas1.toDataURL('image/png');

			// (inner) addImage(imageData, format, x, y, width, height, alias, compression, rotation)
			doc.addImage(amazonOriginalScanImgData, 'PNG', 0.1, 1.25, 0, 1.5, 'qrcode', 'NONE');
		});

		qrcode.toCanvas(trackingNumber, qrOptions, function (error, canvas2) {
			if (error) console.error(error);
			console.log('Generating Tracking QR code...');
			console.log('Tracking Number: ', trackingNumber);
			const trackingNumberImgData = canvas2.toDataURL('image/png');

			// (inner) addImage(imageData, format, x, y, width, height, alias, compression, rotation)
			doc.addImage(trackingNumberImgData, 'PNG', 2.5, 1.25, 0.75, 0, 'tracking', 'NONE');
		});

		// Tracking Number Text
		doc.line(0, 3, 4, 3);
		doc.rect(3.5, 3, 0.5, 0.5, 'F');
		doc.setLineWidth(0.025);
		doc.line(0, 3.5, 4, 3.5);
		doc.setFontSize(10);
		doc.text(0.1, 3.2, 'UPS Ground');
		doc.text(0.1, 3.4, 'Tracking #:');
		doc.text(1, 3.4, trackingNumberReadbale);

		// Tracking Barcode
		let trackingBarcodeImgData: string = createBarcode(trackingNumber);
		doc.addImage(trackingBarcodeImgData, 'PNG', 0.5, 3.6, 3, 0.5, 'tracking-barcode', 'NONE');

		doc.setFont('helvetica');

		doc.setLineWidth(0.05);
		doc.line(0, 4.25, 4, 4.25);

		// Amazon Info
		doc.setFontSize(8);
		doc.text(0.1, 4.4, 'BILLING: P/P');
		doc.text(0.1, 4.5, 'DESC: ' + returnItem);
		doc.text(0.1, 4.6, 'RETURN SERVICE');
		doc.text(0.1, 4.7, 'REFERENCE NO:');
		doc.text(1.1, 4.7, referenceNumberReadable);

		doc.setLineWidth(0.025);
		doc.line(0, 4.75, 4, 4.75);

		//Reference Code

		// doc.setFontSize(45);
		// doc.text(1.7, 5.5, referenceID, { align: 'center' });
		// doc.setFont('monotype-corsiva');

		let amazonReferenceCodeImgData: string = createBarcode(referenceID);
		doc.addImage(amazonReferenceCodeImgData, 'PNG', 1, 5.25, 2, 0.25, 'reference-barcode', 'NONE');

		doc.setFontSize(12);
		doc.text(2, 5, referenceID, { align: 'center' });

		doc.setFont('helvetica');

		// E Code
		doc.setFontSize(20);
		doc.text(3.25, 5.5, ecode);

		// Check to see if auto-print is enabled
		if (autoPrint === true) {
			doc.autoPrint();
		}

		// Save the PDF with current date only, no time
		let dateReadable: string = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		// Increase scan number by 1
		scanNumber++;
		doc.save(`AR-${dateReadable}-${scanNumber}.pdf`);

		// Copy tracking number to clipboard if enabled
		if (copyTrackingNumber === true) {
			navigator.clipboard.writeText(trackingNumber);
		}

		// Clear the QR code input field
		clearInput();
	}

	function errorMessage(error: string) {
		console.log(error);
		showBanner = true;
		bannerMessage = error;
		bannerColor = 'red';
		setTimeout(() => {
			showBanner = false;
			bannerMessage = '';
			bannerColor = '';
		}, 5000);
	}

	function clearInput() {
		qrInput = '';
		if (savePreviousReturn === false) {
			returnName = '';
			returnAddress = '';
			returnSuite = '';
			returnCity = '';
			returnState = '';
			returnZip = '';
		}
	}
</script>

<!-- HTML -->
<section id="banner" style="background-color: {bannerColor}; display: block;">
	<!-- Banner Area -->
	{#if showBanner === true}
		<p>{bannerMessage}</p>
	{/if}
</section>

<section class="Heading">
	<!-- Tittle -->
	<h1 id="title-01">Amazon QR Code Converter</h1>
	<p>
		Paste or scan your Amazon QR return code here. Compatible returns will be downloaded as a PDF
		label.
	</p>
	<p>
		This is an open source project designed by <a href="https://ihelpu.tech">iHelpU.Tech</a>.
		You can contribute to the project by visiting the <a href="https://github.com/ihelpu-tech/amazon-qrcode-label-creator">GitHub</a> page.
		<br>
		Custom implementations are available for a fee. Contact us for more information.
	</p>
</section>
<div>
	<!-- User Info -->
	<h2>Return Shipping</h2>
	<p>Please enter your return shipping information in case your package cannot be delivered.</p>
	<form id="customer-info">
		<div class="form-group">
			<label for="name">Name</label>
			<input type="text" name="name" id="name" bind:value={returnName} placeholder="Return Name" />
		</div>

		<div class="form-group">
			<label for="address">Address</label>
			<input
				type="text"
				name="address"
				id="address"
				bind:value={returnAddress}
				placeholder="Return Address"
			/>
		</div>

		<div class="form-group">
			<label for="suite">Suite</label>
			<input
				type="text"
				name="suite"
				id="suite"
				bind:value={returnSuite}
				placeholder="Suite (optional)"
			/>
		</div>

		<div class="form-group">
			<label for="city">City</label>
			<input type="text" name="city" id="city" bind:value={returnCity} placeholder="Return City" />
		</div>

		<div class="form-group">
			<label for="state">State</label>
			<input
				type="text"
				name="state"
				id="state"
				bind:value={returnState}
				placeholder="Return State"
			/>
		</div>

		<div class="form-group">
			<label for="zip">ZIP</label>
			<input type="text" name="zip" id="zip" bind:value={returnZip} placeholder="Return ZIP" />
		</div>
	</form>
	<h3>Settings</h3>
	<form id="checkboxes">
		<label for="save-return">Save Return Info</label>
		<input
			type="checkbox"
			name="save-return"
			id="save-return-checkbox"
			bind:checked={savePreviousReturn}
		/>
		<br />
		<label for="copy-tracking-number">Copy Tracking Number on Scan</label>
		<input
			type="checkbox"
			name="copy-tracking-number"
			id="copy-tracking-number-checkbox"
			bind:checked={copyTrackingNumber}
		/>
		<br />
		<label for="auto-print">Auto Print after Scan</label>
		<input type="checkbox" name="auto-print" id="auto-print-checkbox" bind:checked={autoPrint} />
	</form>
</div>
<br />
<div id="qr-input">
	<!-- QR Code Input -->
	<!-- svelte-ignore a11y-autofocus -->
	<h2>Scan Code Here:</h2>
	<!-- svelte-ignore a11y-autofocus -->
	<textarea
		id="qr-code-input"
		name="Enter QR Code"
		placeholder="Enter QR Code Here"
		bind:value={qrInput}
		on:keypress={(e) => {
			if (e.key === 'Enter' && qrInput.length > 0) {
				createTheLabel();
			}
		}}
	/>
	<br />
	<input
		id="download-button"
		type="submit"
		value="Download Label"
		on:click={() => {
			if (qrInput.length > 0) {
				createTheLabel();
			}
		}}
	/>
</div>

<section id="past-scans">
	<!-- Previous scans -->
	{#if previousScans.length > 0}
		<!-- Seperating line -->
		<hr />
		<button on:click={() => (previousScans = [])}>Clear</button>
		<h2>Previous Scans</h2>
		<ul id="previous-scan-list">
			{#each previousScans as scan}
				<div class="previous-scan">
					<li>{scan}</li>
					<!-- copy scan list item -->
					<button
						on:click={() => {
							navigator.clipboard.writeText(scan);
							// errorMessage('Copied to clipboard');
						}}>Copy</button
					>
				</div>
			{/each}
		</ul>
	{/if}
</section>

<!-- <section>
	<h3>Test Error</h3>
	<button on:click={() => errorMessage('This is a test error message')}>Test Error</button>
</section> -->

<!-- CSS -->
<style>
	/* Make sure the banner section is always 2em tall */
	#banner {
		display: block;
		height: 2em;
		text-align: center;
		text-emphasis: bold;
		color: white;
		margin: 1px;
		padding: auto;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 1.5rem;
	}
	#title-01 {
		margin: auto;
		width: 60%;
		/* border: 3px solid #000000; */
		padding: 10px;
		text-align: center;
		font-size: 40px;
		font-weight: bold;
		font-family: 'Roboto', sans-serif;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		justify-self: center;
		flex-wrap: wrap;
		align-items: center;
		font-family: 'Roboto', sans-serif;
		margin: auto;
		width: auto;
	}

	.previous-scan {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		font-family: 'Roboto', sans-serif;
		margin: .5em;
		padding-top: .5em;
		padding-bottom: .5em;
		/* No bullet for li */
		list-style-type: none;
		border: 1px solid gray;
	}
	#previous-scan-list {
		display: flex;
		flex-direction: column;
		padding-left: 0px;
		margin: .5em;
	}

	#customer-info {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		font-family: 'Roboto', sans-serif;
		margin: auto;
		width: auto;
	}

	#qr-code-input {
		width: 95%;
		height: 4em;
		text-align: center;
		word-wrap: break-word;
		word-break: break-all;
		font-size: 2em;
		border: 1px solid gray;
	}

	#download-button {
		background-color: #4caf50;
		color: white;
		padding: 14px 20px;
		margin: 8px 0;
		border: none;
		cursor: pointer;
	}

	:global(body) {
		width: 95%;
		margin: auto;
		text-align: center;
		padding: auto;
		font-family: 'Roboto', sans-serif;
	}

	/* form {
		display: flex;
		flex-direction: row;
		align-items: center;
	} */

	input[type='text'] {
		width: 200px;
		margin: 10px 0;
		padding: 10px;
		border: 1px solid gray;
	}
</style>
