package com.example.mom.specification;

import com.example.mom.entity.Notebooks;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class NotebooksSpecification {
    public static Specification<Notebooks> filterNotebooks(String search, String authority, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String searchValue = "%" + search.trim().toLowerCase() + "%";
                Predicate notebookIdPredicate = cb.like(cb.lower(root.get("notebookId")), searchValue);
                Predicate notebookNamePredicate = cb.like(cb.lower(root.get("name")), searchValue);
                Predicate descriptionPredicate = cb.like(cb.lower(root.get("description")), searchValue);
                Predicate createdByUserNamePredicate = cb.like(cb.lower(root.get("createdBy").get("userName")), searchValue);
                Predicate createdByEmailPredicate = cb.like(cb.lower(root.get("createdBy").get("email")), searchValue);
                Predicate statusIdPredicate = cb.like(cb.lower(root.get("status").get("statusId")), searchValue);
                Predicate statusDescriptionPredicate = cb.like(cb.lower(root.get("status").get("description")), searchValue);
                predicates.add(cb.or(notebookIdPredicate, notebookNamePredicate, descriptionPredicate, createdByUserNamePredicate, createdByEmailPredicate, statusIdPredicate, statusDescriptionPredicate));
            }
            if (authority != null && !authority.trim().isEmpty()) {
                predicates.add(cb.like(cb.upper(root.get("createdBy").get("authorityProfiles").get("authorityName")), "%" + authority.trim().toUpperCase() + "%"));
            }
            if (status != null && !status.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("status").get("statusId"), status.trim().toUpperCase()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}