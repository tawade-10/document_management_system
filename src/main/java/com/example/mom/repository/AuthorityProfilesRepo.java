package com.example.mom.repository;


import com.example.mom.entity.AuthorityProfiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorityProfilesRepo extends JpaRepository<AuthorityProfiles, String> {

    @Query(value = """
            SELECT authority_id
            FROM authority
            ORDER BY authority_id DESC
            LIMIT 1
            """, nativeQuery = true)
    String findLastAuthorityId();
}