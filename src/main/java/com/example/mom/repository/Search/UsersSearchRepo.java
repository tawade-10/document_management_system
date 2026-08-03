package com.example.mom.repository.Search;

import com.example.mom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersSearchRepo extends JpaRepository<Users,String> {

    @Query("SELECT u FROM Users u " +
            "WHERE LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Users> searchUser(@Param("keyword") String keyword);
}
