package com.musichouse.api.music.infra;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Component
public class MailManager {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailManager.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String sender;

    private void addInlineImages(MimeMessageHelper helper) throws MessagingException {
        try {
            // Cargar imágenes
            helper.addInline("whatsappIcon", new ClassPathResource("static/img/whatsapp01.png"));
            helper.addInline("instagramIcon", new ClassPathResource("static/img/instagram01.png"));
            helper.addInline("facebookIcon", new ClassPathResource("static/img/facebook01.png"));
            helper.addInline("xIcon", new ClassPathResource("static/img/x01.png"));
            helper.addInline("logoImage", new ClassPathResource("static/img/house.png"));
            helper.addInline("backgroundImage", new ClassPathResource("static/img/magen3.png"));

            // Debug para verificar existencia
            Resource res = new ClassPathResource("static/img/whatsapp01.png");
            LOGGER.info("🔍 Imagen whatsapp01.png - exists: {}, path: {}", res.exists(), ((ClassPathResource) res).getPath());

        } catch (Exception ex) {
            LOGGER.error("❌ Error al cargar imágenes inline para email: {}", ex.getMessage(), ex);
            throw new MessagingException("Error al cargar imágenes inline", ex);
        }
    }

    public void sendMessage(String email, String name, String lastName) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Confirmación de Registro");

            Context context = new Context();
            context.setVariable("nombre", name);
            context.setVariable("apellido", lastName);

            String content = templateEngine.process("email_register", context);
            helper.setText(content, true);
            helper.setFrom(sender);

            addInlineImages(helper);
            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendReservationConfirmation(String email,
                                            String name,
                                            String lastName,
                                            String instrumentName,
                                            LocalDate startDate,
                                            LocalDate endDate,
                                            String reservationCode,
                                            BigDecimal totalPrice,
                                            String imageURL) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Confirmación de Reserva");

            Context context = new Context();
            context.setVariable("nombre", name);
            context.setVariable("apellido", lastName);
            context.setVariable("instrumento", instrumentName);
            context.setVariable("fechaInicio", startDate.toString());
            context.setVariable("fechaFin", endDate.toString());
            context.setVariable("codigoReserva", reservationCode);
            context.setVariable("precioTotal", totalPrice.toString());
            context.setVariable("imagenURL", imageURL);

            String content = templateEngine.process("email_reservation", context);
            helper.setText(content, true);
            helper.setFrom(sender);

            addInlineImages(helper);
            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendVerificationCodeEmail(String email, String name, String lastName, String code) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Verifica tu cuenta en MusicHouse");

            Context context = new Context();
            context.setVariable("nombre", name);
            context.setVariable("apellido", lastName);
            context.setVariable("codigo", code);

            String content = templateEngine.process("email_verification", context);
            helper.setText(content, true);
            helper.setFrom(sender);

            addInlineImages(helper);
            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}

