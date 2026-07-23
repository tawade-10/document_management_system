package com.example.mom.service.Email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailServiceImpl{

    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendSimpleMessage(String to, String subject, String text, String attachment) throws MessagingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message,true);
        mimeMessageHelper.setFrom("tawadeshubham10@gmail.com");
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setText(text);
        mimeMessageHelper.setSubject(subject);

        if (attachment != null && !attachment.isBlank()) {
            FileSystemResource file = new FileSystemResource(new File(attachment));
            mimeMessageHelper.addAttachment(file.getFilename(), file);
        }

        System.out.println("Mail with attachment sent successfully");

        javaMailSender.send(message);
    }
}
