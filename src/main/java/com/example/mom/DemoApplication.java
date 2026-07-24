package com.example.mom;

import com.example.mom.service.Email.EmailServiceImpl;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class DemoApplication {

    @Autowired
    private EmailServiceImpl emailServiceImpl;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

    @EventListener(ApplicationReadyEvent.class)
    public void triggerEmail() throws MessagingException {
        emailServiceImpl.sendSimpleMessage("tawadeshubham10@gmail.com",
                "This is Body",
                "This is mail attachment",
                "/Users/Shubham Tawade/Downloads/SHUBHAM TAWADE RESUME.pdf");
    }

}
