package com.example.mom.config;

import com.example.mom.entity.AuthorityProfiles;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class CustomIdGenerator {

    private final JdbcTemplate jdbcTemplate;

    public CustomIdGenerator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String generateUserId(AuthorityProfiles authority) {

        Long nextValue = jdbcTemplate.queryForObject(
                "SELECT nextval('user_seq')",
                Long.class
        );

        String authorityId = authority.getAuthorityId();
        String authorityNumber = authorityId.substring(authorityId.length() - 1);
        return String.format("U%sA%04d", authorityNumber, nextValue);
    }

    public String generateNotebookId() {

        Long nextValue = jdbcTemplate.queryForObject(
                "SELECT nextval('notebook_seq')",
                Long.class
        );

        return String.format("NA%04d", nextValue);
    }

    public String generatePageId() {

        Long nextValue = jdbcTemplate.queryForObject(
                "SELECT nextval('page_seq')",
                Long.class
        );

        return String.format("PA%04d", nextValue);
    }

    public String generateAttachmentId() {

        Long nextValue = jdbcTemplate.queryForObject(
                "SELECT nextval('attachment_seq')",
                Long.class
        );

        return String.format("AA%04d", nextValue);
    }
}