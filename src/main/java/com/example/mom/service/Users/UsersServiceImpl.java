package com.example.mom.service.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import com.example.mom.specification.UsersSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    public Page<UsersCreationResponseDto> getAllUsers(int page, int size, String search, String authority, String status, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Users> specification = UsersSpecification.filterUsers(search, authority, status);
        Page<Users> usersPage = usersRepo.findAll(specification, pageable);
        return usersPage.map(UsersCreationResponseDto::new);
    }

    @Override
    public UsersCreationResponseDto getUserById(String userId) {

        Users user = usersRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not found"));

        return new UsersCreationResponseDto(user);
    }

    @Override
    public UsersCreationResponseDto updateUserDetails(String userId, UsersCreationRequestDto usersCreationRequestDto) {

        Users user = usersRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (usersCreationRequestDto.getUserName() == null ||
                usersCreationRequestDto.getUserName().trim().isEmpty()) {
            throw new RuntimeException("User name cannot be empty");
        }

        if (usersCreationRequestDto.getEmail() == null ||
                usersCreationRequestDto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }

        user.setUserName(usersCreationRequestDto.getUserName().trim());
        user.setEmail(usersCreationRequestDto.getEmail().trim());
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

        Users user = usersRepo.findById(userId)
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

