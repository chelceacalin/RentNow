from confluent_kafka import Consumer, KafkaError
import json
from service.chroma_service import add_book_to_collection
from model.Book import Book
from config.logger_config import logger


def create_kafka_consumer():
    return Consumer({
        'bootstrap.servers': '127.0.0.1:9092',
        'group.id': 'cID',
        'auto.offset.reset': 'latest'
    })


def kafka_listener():
    consumer = create_kafka_consumer()
    consumer.subscribe(['BOOK_RETURNED'])
    logger.info("Kafka listener started and subscribed to BOOK_RETURNED")

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    logger.error(f"Kafka error: {msg.error()}")
                    break

            data = json.loads(msg.value().decode('utf-8'))
            logger.info(f"Message received: {data}")
            user_email = data.get('user_email')
            category = data.get('category')
            title = data.get('title')
            book = Book(title, category)
            add_book_to_collection(user_email, book)
            logger.info(f"Book added for user {user_email}: {book}")

    except KeyboardInterrupt:
        logger.info("Kafka listener interrupted.")
    finally:
        consumer.close()
