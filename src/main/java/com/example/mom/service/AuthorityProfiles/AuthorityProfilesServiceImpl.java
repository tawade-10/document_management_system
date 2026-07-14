package com.example.mom.service.AuthorityProfiles;

import com.example.mom.entity.AuthorityProfiles;
import com.example.mom.repository.AuthorityProfilesRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthorityProfilesServiceImpl implements AuthorityProfilesService{

    private final AuthorityProfilesRepo authorityProfilesRepo;

    public AuthorityProfilesServiceImpl(AuthorityProfilesRepo authorityProfilesRepo) {
        this.authorityProfilesRepo = authorityProfilesRepo;
    }

    public AuthorityProfiles saveAuthority(AuthorityProfiles authorityProfiles) {

        String lastId = authorityProfilesRepo.findLastAuthorityId();

        int nextId = 0;

        if (lastId != null) {
            nextId = Integer.parseInt(lastId) + 1;
        }

        authorityProfiles.setAuthorityId(String.format("%03d", nextId));
        authorityProfiles.setCreatedAt(LocalDateTime.now());

        return authorityProfilesRepo.save(authorityProfiles);
    }
}
