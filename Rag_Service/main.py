from threading import Thread

from flask import Flask, jsonify
from service.kafka_service import kafka_listener
from service.ai_service import generate_recommendations_from_ai
from service.chroma_service import get_books_for_user

app = Flask(__name__)


@app.route('/get_recommendations/<userEmail>', methods = ['GET'])
def get_recommendations(userEmail: str):
    books_read = get_books_for_user(userEmail)
    recommendations = generate_recommendations_from_ai(books_read)
    return jsonify({"bookRecommendations": recommendations})


if __name__ == '__main__':
    kafka_thread = Thread(target = kafka_listener, daemon = True)
    kafka_thread.start()
    app.run(port = 5000, debug = True, host = '0.0.0.0')
