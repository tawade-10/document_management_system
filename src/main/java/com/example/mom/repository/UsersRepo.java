package com.example.mom.repository;

import com.example.mom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<Users,String> {

    Optional<Users> findByEmail(String email);

    Optional<Users> findByUserName(String userName);
}
