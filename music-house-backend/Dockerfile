# =========================
# ETAPA 1: BUILD
# =========================
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Variables para mejorar el caché de Maven
WORKDIR /build

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

# =========================
# ETAPA 2: RUNTIME
# =========================
FROM eclipse-temurin:21-jammy

# Crear usuario no root por seguridad
RUN groupadd --system appgroup && useradd --system --gid appgroup --create-home victor

USER victor

WORKDIR /app

# Copiamos solo el JAR generado
COPY --from=builder /build/target/*.jar app.jar

# Exponemos el puerto de Spring Boot
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]