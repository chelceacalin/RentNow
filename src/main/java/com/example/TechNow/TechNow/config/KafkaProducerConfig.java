package com.example.TechNow.TechNow.config;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Configuration
public class KafkaProducerConfig {

	private static final Logger log = LoggerFactory.getLogger(KafkaProducerConfig.class);
	@Value("${spring.kafka.bootstrap-servers}")
	private String bootstrapServers;

	@Value("${custom.kafka_topics}")
	private List<String> kafkaTopics;

	@Bean
	public ProducerFactory<String, String> producerFactory() {
		Map<String, Object> configProps = new HashMap<>();
		configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
		configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		return new DefaultKafkaProducerFactory<>(configProps);
	}

	@Bean
	public KafkaTemplate<String, String> kafkaTemplate() {
		return new KafkaTemplate<>(producerFactory());
	}

	@Bean
	public KafkaAdmin admin() {
		Map<String, Object> configs = new HashMap<>();
		configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
		return new KafkaAdmin(configs);
	}

	@Bean
	public List<NewTopic> createTopics() {
		List<NewTopic> topics = new ArrayList<>();
		int partitions = 10;
		short replicationFactor = 2;

		try (AdminClient adminClient = AdminClient.create(admin().getConfigurationProperties())) {
			List<String> existingTopics = new ArrayList<>(adminClient.listTopics().names().get());

			for (String topicName : kafkaTopics) {
				if (!existingTopics.contains(topicName)) {
					log.info("[KAFKA]: Creating topic {}", topicName);
					topics.add(new NewTopic(topicName, partitions, replicationFactor));
				}
			}
		} catch (InterruptedException | ExecutionException e) {
			throw new RuntimeException("Error:", e);
		}

		return topics;
	}
}
