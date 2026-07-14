package com.example.mom.repository;

import com.example.mom.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RolesRepo extends JpaRepository<Roles, String> {

    @Query(value = "SELECT role_id FROM roles ORDER BY role_id DESC LIMIT 1", nativeQuery = true)
    String findLastRoleId();
}