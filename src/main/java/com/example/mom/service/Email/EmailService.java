package com.example.mom.service.Email;

import jakarta.mail.MessagingException;

public interface EmailService {

    void sendSimpleMessage(String to, String subject, String text, String attachment) throws MessagingException;

}
