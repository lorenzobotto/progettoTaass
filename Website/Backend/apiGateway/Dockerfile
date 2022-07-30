FROM adoptopenjdk/openjdk11
EXPOSE 8080
ADD /target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway
COPY target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","api-gateway-0.0.1-SNAPSHOT.jar"]