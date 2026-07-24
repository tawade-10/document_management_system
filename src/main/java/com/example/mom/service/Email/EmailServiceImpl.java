package com.example.mom.service.Email;

import com.example.mom.entity.Attachments;
import com.example.mom.entity.Pages;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailServiceImpl {

    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendSimpleMessage(String to, String subject, String text, String attachment) throws MessagingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("tawadeshubham10@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);

        if (attachment != null && !attachment.isBlank()) {
            FileSystemResource file = new FileSystemResource(new File(attachment));
            helper.addAttachment(file.getFilename(), file);
        }

        javaMailSender.send(message);
        System.out.println("Mail sent successfully.");
    }

    public void sendPublishedPage(Pages page) throws MessagingException {

        String participants = page.getParticipants();

        if (participants == null || participants.isBlank()) {
            throw new RuntimeException("No participants found.");
        }

        String[] emails = participants.split(",");

        for (String email : emails) {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("tawadeshubham10@gmail.com");
            helper.setTo(email.trim());
            helper.setSubject(page.getTitle());
            helper.setText(page.getPageContent(), true);
            for (Attachments attachment : page.getAttachments()) {
                File file = new File("uploads", attachment.getFilePath());
                if (file.exists()) {
                    helper.addAttachment(attachment.getFileName(), new FileSystemResource(file));
                }
            }
            javaMailSender.send(message);
        }
        System.out.println("Published page emailed successfully.");
    }
}