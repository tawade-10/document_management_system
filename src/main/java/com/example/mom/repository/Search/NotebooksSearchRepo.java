package com.example.mom.repository.Search;

import com.example.mom.dto.Notebooks.NotebooksResponseDto;
import com.example.mom.entity.Notebooks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotebooksSearchRepo extends JpaRepository<Notebooks,String>{

    @Query("SELECT n FROM Notebooks n " +
            "WHERE LOWER(n.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Notebooks> searchNotebook(@Param("keyword") String keyword);
}
