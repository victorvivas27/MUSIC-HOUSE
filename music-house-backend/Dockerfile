FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /home/app

COPY pom.xml .
COPY src ./src

RUN mvn package

FROM openjdk:17.0.1-jdk

WORKDIR /usr/src/app

COPY --from=build /home/app/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]