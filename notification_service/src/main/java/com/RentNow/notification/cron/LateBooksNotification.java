package com.RentNow.notification.cron;

import com.RentNow.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class LateBooksNotification {

    final NotificationService notificationService;

    @Scheduled(fixedRateString = "${custom.remindersSchedulerTime}", timeUnit = TimeUnit.MINUTES)
    void sendLateBooksNotification() {
        log.info("[sendLateBooksNotification] start");
        notificationService.sendLateBooksNotification();
        log.info("[sendLateBooksNotification] end");
    }
}
