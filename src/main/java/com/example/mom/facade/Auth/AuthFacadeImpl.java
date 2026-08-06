package com.example.mom.facade.Auth;

import com.example.mom.config.JwtService;
import com.example.mom.dto.Users.LoginRequestDto;
import com.example.mom.dto.Users.LoginResponseDto;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.CustomUserDetails;
import com.example.mom.entity.LoginResponse;
import com.example.mom.service.Auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
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

    public AuthFacadeImpl(JwtService jwtService, AuthenticationManager authenticationManager, AuthService authService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.authService = authService;
    }

    @Override
    public UsersCreationResponseDto addUser(UsersCreationRequestDto usersCreationRequestDto) {
        return authService.addUser(usersCreationRequestDto);
    }

    @Override
    public Object loginCustomer(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
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

    @Override
    public Object logoutCustomer(HttpServletRequest request) {
        return authService.logoutCustomer(request);
    }
}
