package com.example.mom.config;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;

public class CustomIdGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {

        String lastId = (String) session.createNativeQuery(
                        "SELECT role_id FROM roles ORDER BY role_id DESC LIMIT 1")
                .getSingleResult();

        int nextId = 0;

        if (lastId != null) {
            nextId = Integer.parseInt(lastId) + 1;
        }

        return String.format("%04d", nextId);
    }
}