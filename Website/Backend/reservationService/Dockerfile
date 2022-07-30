FROM adoptopenjdk/openjdk11
EXPOSE 8082
ADD /target/reservation-service-0.0.1-SNAPSHOT.jar reservation-service
COPY target/reservation-service-0.0.1-SNAPSHOT.jar reservation-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","reservation-service-0.0.1-SNAPSHOT.jar"]