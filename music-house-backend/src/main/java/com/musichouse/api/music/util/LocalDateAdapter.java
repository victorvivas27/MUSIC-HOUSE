package com.musichouse.api.music.util;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Adaptador personalizado para serializar y deserializar objetos LocalDate con Gson.
 * <p>
 * Este adaptador asegura que las fechas se manejen en formato "yyyy-MM-dd" (ISO sin zona horaria).
 * Es útil cuando quieres controlar cómo Gson convierte fechas a JSON y viceversa, sin preocuparte por zonas horarias.
 */
public class LocalDateAdapter implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {

    // Formato de fecha que se utilizará tanto para serialización como deserialización
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Convierte un LocalDate en un JsonPrimitive (cadena de texto) con el formato "yyyy-MM-dd".
     *
     * @param localDate
     *         Fecha local a convertir.
     * @param srcType
     *         Tipo del objeto fuente (usualmente LocalDate).
     * @param context
     *         Contexto de serialización de Gson.
     *
     * @return JsonElement que representa la fecha como cadena.
     */
    @Override
    public JsonElement serialize(LocalDate localDate, Type srcType, JsonSerializationContext context) {
        return new JsonPrimitive(dateFormatter.format(localDate));
    }

    /**
     * Convierte una cadena en formato "yyyy-MM-dd" a un objeto LocalDate.
     *
     * @param json
     *         Elemento JSON que contiene la fecha como string.
     * @param typeOfT
     *         Tipo esperado (LocalDate).
     * @param context
     *         Contexto de deserialización de Gson.
     *
     * @return Objeto LocalDate.
     *
     * @throws JsonParseException
     *         Si el string no tiene el formato esperado.
     */
    @Override
    public LocalDate deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        return LocalDate.parse(
                json.getAsString(),
                DateTimeFormatter.ofPattern("yyyy-MM-dd").withLocale(Locale.ENGLISH)
        );
    }
}
