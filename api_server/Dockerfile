FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/api_server-0.0.1.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]
