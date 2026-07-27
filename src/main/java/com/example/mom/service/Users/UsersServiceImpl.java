package com.example.mom.service.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService{

    private final UsersRepo usersRepo;

    private final StatusRepo statusRepo;

    public UsersServiceImpl(UsersRepo usersRepo, StatusRepo statusRepo) {
        this.usersRepo = usersRepo;
        this.statusRepo = statusRepo;
    }

    @Override
    public List<UsersCreationResponseDto> getAllUsers() {
        List<Users> users = usersRepo.findAll();
        return users.stream().map(UsersCreationResponseDto::new).collect(Collectors.toList());
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
                .orElseThrow(() -> new RuntimeException("User Not found"));

        user.setUserName(usersCreationRequestDto.getUserName());
        user.setEmail(usersCreationRequestDto.getEmail());
        user.setUpdatedAt(LocalDateTime.now());

        Users updatedUser = usersRepo.save(user);
        return new UsersCreationResponseDto(updatedUser);
    }

    @Override
    public UsersCreationResponseDto updateUserStatus(String userId) {

        Users user = usersRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not found"));

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
