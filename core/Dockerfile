FROM amazoncorretto:21.0.4-alpine3.18

WORKDIR /app

COPY target/core-0.0.1.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]