package com.example.mom.specification;

import com.example.mom.entity.Users;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UsersSpecification {

    public static Specification<Users> filterUsers(String search, String authority, String status) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                Predicate userNamePredicate = cb.like(
                        cb.lower(root.get("userName")),
                        "%" + search.toLowerCase() + "%"
                );
                Predicate emailPredicate = cb.like(
                        cb.lower(root.get("email")),
                        "%" + search.toLowerCase() + "%"
                );
                predicates.add(cb.or(userNamePredicate, emailPredicate));
            }
            if (authority != null && !authority.trim().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.upper(root.get("authorityProfiles").get("authorityName")),
                                "%" + authority.toUpperCase() + "%"
                        )
                );
            }
            if (status != null && !status.trim().isEmpty()) {
                predicates.add(
                        cb.equal(
                                root.get("status").get("statusId"),
                                status
                        )
                );
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}