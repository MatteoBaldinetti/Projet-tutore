package com.agora.pretetgo.repositories;

import com.agora.pretetgo.models.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long>, JpaSpecificationExecutor<UserNotification> {
}
