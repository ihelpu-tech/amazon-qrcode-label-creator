# Amazon Return QR Code Label Generator

Generates a label from the Amazon return QR codes. This allows you to take your package to any UPS authorized retailer, UPS Access Points, or any UPS drop-off location. 

## Usage
1. Clone the repoistory or download a ZIP copy.
1. Edit the return address at the top of the `index.js` file to match your location.
1. Open scan-qr-code.html in your browser and follow the on screen instructions.

## Docker
You can also clone the docker image by running: 
```
docker run -d -p 8080:80 \
    -e RETURNNAME="Your Company" \
    -e RETURNADDRESS="123 Main St" \
    -e RETURNCITY="Anytown" \
    -e RETURNSTATE="CA" \
    -e RETURNZIP="12345" \
    benihelputech/amazon-return-qr-code-label-generator:latest
```

To manually build the docker image, run the following commands:
```
git clone https://github.com/ihelpu-tech/amazon-qrcode-label-creator
cd amazon-qrcode-label-creator
docker build -t amazon-return-qr-code-label-generator .
```
## Privacy
This application does not collect any data. The QR code is scanned locally in your browser and the label data is generated locally in your browser. 

## Dependancies
This project does not have any dependancies to generate the ZPL output. It is a single HTML file and a single JavaScript file. To convert the ZPL output to a PDF, we recommend using [labelary.com](labelary.com). We may integrate their API in the future.

## Support
The software is provided as is with no warranty. See [License](LICENSE) for details. 

For custom integrations or paid support of this software or other inquiries, please contact iHelpU.Tech at 217-994-9412 or by emailing support@ihelpu.tech