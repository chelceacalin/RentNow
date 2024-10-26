package com.example.TechNow.TechNow.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MessageProducer {

	final KafkaTemplate<String, String> kafkaTemplate;

	@Value("${custom.kafka.enabled}")
	boolean kafkaEnabled;

	public void sendMessage(String topic, String message) {
		if (!kafkaEnabled) {
			log.info("[KAFKA] is not enabled");
			return;
		}
		log.info("Message sent to topic {} : {}", topic, message);
		kafkaTemplate.send(topic, message);
	}
}
