package com.example.mom.repository;

import com.example.mom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<Users, String>, JpaSpecificationExecutor<Users> {

    Optional<Users> findByEmail(String email);

    Optional<Users> findByUserName(String userName);
}