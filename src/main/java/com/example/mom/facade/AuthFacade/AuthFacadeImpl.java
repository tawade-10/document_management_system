package com.example.mom.facade.AuthFacade;

import com.example.mom.config.JwtService;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.CustomUserDetails;
import com.example.mom.entity.LoginResponse;
import com.example.mom.service.Auth.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthFacadeImpl implements AuthFacade{

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final BCryptPasswordEncoder encoder;

    public AuthFacadeImpl(JwtService jwtService, AuthenticationManager authenticationManager, AuthService authService, BCryptPasswordEncoder encoder) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.encoder = encoder;
    }

    @Override
    public UsersCreationResponseDto addUser(UsersCreationRequestDto usersCreationRequestDto) {
        usersCreationRequestDto.setPassword(encoder.encode(usersCreationRequestDto.getPassword()));
        return authService.addUser(usersCreationRequestDto);
    }

    @Override
    public Object loginCustomer(UsersCreationRequestDto usersCreationRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        usersCreationRequestDto.getEmail(),
                        usersCreationRequestDto.getPassword()
                )
        );

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                        token,
                        user.getUsers().getUserName(),
                        user.getUsers().getEmail(),
                        user.getUsers().getAuthorityProfiles().getAuthorityName(),
                        user.getUsers().getUserId()
        );
    }

    @Override
    public String generateResetToken(String email) {
        return authService.generateResetToken(email);
    }

    @Override
    public String resetPassword(String token, String newPassword) {
        return authService.resetPassword(token,newPassword);
    }
}
