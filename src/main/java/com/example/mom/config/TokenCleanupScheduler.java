package com.example.mom.config;

import com.example.mom.repository.BlacklistedTokenRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class TokenCleanupScheduler {

    private final BlacklistedTokenRepo blacklistedTokenRepo;

    public TokenCleanupScheduler(BlacklistedTokenRepo blacklistedTokenRepo) {
        this.blacklistedTokenRepo = blacklistedTokenRepo;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanExpiredTokens() {
        blacklistedTokenRepo.deleteByExpiryTimeBefore(LocalDateTime.now());
    }
}