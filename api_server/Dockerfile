# Stage 1: Build
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/target/api_server-0.0.1.jar ./api_server.jar

EXPOSE 8761
CMD ["java", "-jar", "api_server.jar"]
