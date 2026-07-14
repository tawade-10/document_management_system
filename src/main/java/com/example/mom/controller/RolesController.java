package com.example.mom.controller;

import com.example.mom.entity.Roles;
import com.example.mom.service.roles.RolesService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/roles")
public class RolesController {

    private final RolesService rolesService;

    public RolesController(RolesService rolesService) {
        this.rolesService = rolesService;
    }

    @PostMapping
    public Roles save(@RequestBody Roles role) {
        return rolesService.saveRole(role);
    }
}