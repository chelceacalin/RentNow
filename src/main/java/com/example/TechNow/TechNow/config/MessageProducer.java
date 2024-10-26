package com.example.TechNow.TechNow.config;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageProducer {

	private static final Logger log = LoggerFactory.getLogger(MessageProducer.class);
	final KafkaTemplate<String, String> kafkaTemplate;

	public void sendMessage(String topic, String message) {
		log.info("Message sent to topic " + topic + " : " + message);
		kafkaTemplate.send(topic, message);
	}
}
