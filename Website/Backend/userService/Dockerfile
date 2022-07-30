FROM adoptopenjdk/openjdk11
EXPOSE 8082
ADD /target/user-service-0.0.1-SNAPSHOT.jar user-service
COPY target/user-service-0.0.1-SNAPSHOT.jar user-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","user-service-0.0.1-SNAPSHOT.jar"]