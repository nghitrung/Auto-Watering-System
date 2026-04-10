FROM eclipse-mosquitto:latest

RUN mkdir -p /config /data /log

COPY config/ /config/ 

# encode password
RUN mosquitto_passwd -b -c /config/pwfile auto_watering_system 123 

RUN chown -R mosquitto:mosquitto /config /data /log
