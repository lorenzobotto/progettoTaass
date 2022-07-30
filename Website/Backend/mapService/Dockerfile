FROM adoptopenjdk/openjdk11
EXPOSE 8082
ADD /target/map-service-0.0.1-SNAPSHOT.jar map-service
COPY target/map-service-0.0.1-SNAPSHOT.jar map-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","map-service-0.0.1-SNAPSHOT.jar"]