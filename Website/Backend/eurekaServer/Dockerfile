FROM adoptopenjdk/openjdk11
EXPOSE 8761
ADD /target/eureka-server-0.0.1-SNAPSHOT.jar eureka-server
COPY target/eureka-server-0.0.1-SNAPSHOT.jar eureka-server-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","eureka-server-0.0.1-SNAPSHOT.jar"]