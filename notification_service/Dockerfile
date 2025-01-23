FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/notification-0.0.1.jar app.jar

EXPOSE 8091

ENTRYPOINT ["java", "-jar", "app.jar"]
