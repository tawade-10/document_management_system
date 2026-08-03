package com.example.mom.repository.Search;

import com.example.mom.entity.Pages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface PagesSearchRepo extends JpaRepository<Pages,String> {

    @Query("SELECT p FROM Pages p " +
            "WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Pages> searchPage(@Param("keyword") String keyword);
}
