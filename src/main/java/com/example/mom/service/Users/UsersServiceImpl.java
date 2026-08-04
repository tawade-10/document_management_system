package com.example.mom.service.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class UsersServiceImpl implements UsersService{

    private final UsersRepo usersRepo;

    private final StatusRepo statusRepo;

    public UsersServiceImpl(UsersRepo usersRepo, StatusRepo statusRepo) {
        this.usersRepo = usersRepo;
        this.statusRepo = statusRepo;
    }

    @Override
    public Page<UsersCreationResponseDto> getAllUsers(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Users> usersPage=usersRepo.findAll(pageable);
        return usersPage.map(UsersCreationResponseDto::new);
    }

    @Override
    public UsersCreationResponseDto getUserById(String userId) {

        Users user = usersRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not found"));

        return new UsersCreationResponseDto(user);
    }

    @Override
    public UsersCreationResponseDto updateUserDetails(UsersCreationRequestDto usersCreationRequestDto) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        user.setUserName(usersCreationRequestDto.getUserName());
        user.setEmail(usersCreationRequestDto.getEmail());
        user.setUpdatedAt(LocalDateTime.now());

        Users updatedUser = usersRepo.save(user);
        return new UsersCreationResponseDto(updatedUser);
    }

    @Override
    public UsersCreationResponseDto updateUserStatus(String userId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.getStatus().getStatusId().equals("UAC")) {
            Status inactiveStatus = statusRepo.findById("UIA")
                    .orElseThrow(() -> new RuntimeException("Inactive status not found"));
            user.setStatus(inactiveStatus);
        } else {
            Status activeStatus = statusRepo.findById("UAC")
                    .orElseThrow(() -> new RuntimeException("Active status not found"));
            user.setStatus(activeStatus);
        }
        user.setUpdatedAt(LocalDateTime.now());
        Users updatedUser = usersRepo.save(user);
        return new UsersCreationResponseDto(updatedUser);
    }
}

