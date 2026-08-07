package com.example.mom.controller;

import com.example.mom.dto.Passwords.CreatePasswordRequestDto;
import com.example.mom.dto.Users.LoginRequestDto;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.facade.Auth.AuthFacade;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsersCreationResponseDto> addUser(@Valid @RequestBody UsersCreationRequestDto usersCreationRequestDto){
        UsersCreationResponseDto registeredCustomer = authFacade.addUser(usersCreationRequestDto);
        return new ResponseEntity<>(registeredCustomer, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto loginRequestDto) {
        Object loginCustomer = authFacade.loginCustomer(loginRequestDto);
        return ResponseEntity.ok(loginCustomer);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        String response = authFacade.generateResetToken(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        String response = authFacade.resetPassword(token, newPassword);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-password")
    public ResponseEntity<?> createPassword(@RequestBody CreatePasswordRequestDto requestDto) {
        String response = authFacade.createPassword(requestDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        Object logoutCustomer = authFacade.logoutCustomer(request);
        return ResponseEntity.ok(logoutCustomer);
    }
}
