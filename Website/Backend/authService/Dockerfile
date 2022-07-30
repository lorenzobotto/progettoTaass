FROM adoptopenjdk/openjdk11
EXPOSE 8081
ADD /target/auth-service-0.0.1-SNAPSHOT.jar auth-service
COPY target/auth-service-0.0.1-SNAPSHOT.jar auth-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","auth-service-0.0.1-SNAPSHOT.jar"]