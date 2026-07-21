package com.example.mom.controller;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.facade.UsersFacade.UsersFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UsersFacade usersFacade;

    public UsersController(UsersFacade usersFacade) {
        this.usersFacade = usersFacade;
    }

    @GetMapping
    public ResponseEntity<List<UsersCreationResponseDto>> getAllUsers(){
        List<UsersCreationResponseDto> allUsers = usersFacade.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UsersCreationResponseDto> getUserById(@PathVariable String userId){
        UsersCreationResponseDto userById = usersFacade.getUserById(userId);
        return ResponseEntity.ok(userById);
    }

    @PutMapping("/updateUserStatus/{userId}")
    public ResponseEntity<UsersCreationResponseDto> updateUserStatus(@PathVariable String userId){
        UsersCreationResponseDto updatedUserStatus = usersFacade.updateUserStatus(userId);
        return ResponseEntity.ok(updatedUserStatus);
    }


}
