package com.example.mom.service.roles;

import com.example.mom.entity.Roles;
import com.example.mom.repository.RolesRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RolesServiceImpl implements RolesService{

    private final RolesRepo rolesRepo;

    public RolesServiceImpl(RolesRepo rolesRepo) {
        this.rolesRepo = rolesRepo;
    }

    public Roles saveRole(Roles role) {

        String lastId = rolesRepo.findLastRoleId();

        int nextId = 0;

        if (lastId != null) {
            nextId = Integer.parseInt(lastId) + 1;
        }

        role.setRoleId(String.format("%04d", nextId));
        role.setCreatedAt(LocalDateTime.now());

        return rolesRepo.save(role);
    }
}