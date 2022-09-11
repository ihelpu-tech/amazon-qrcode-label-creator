FROM nginx:latest

COPY scan-qr-code.html /usr/share/nginx/html/index.html
COPY index.js /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
COPY setENV.sh /

ENV RETURNNAME="Return Solutions LLC"
ENV RETURNADDRESS="1234 Main Street"
ENV RETURNCITY="New York"
ENV RETURNSTATE="NY"
ENV RETURNZIP="10001"

RUN chmod +x /setENV.sh

CMD ["/setENV.sh"]
EXPOSE 80