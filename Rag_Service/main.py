from flask import Flask, request, jsonify
from service.chroma_service import add_book_to_collection, get_books_for_user
from service.ai_service import generate_recommendations_from_ai

app = Flask(__name__)


@app.route('/add_book', methods = ['POST'])
def add_book():
    data = request.get_json()
    user_email = data['userEmail']
    category = data['category']
    name = data['name']
    add_book_to_collection(user_email, category, name)
    return jsonify({"message": "Book added successfully!"})


# Endpoint to get book recommendations for a user
@app.route('/get_recommendations/<userEmail>', methods = ['GET'])
def get_recommendations(userEmail: str):
    books_read = get_books_for_user(userEmail)

    if books_read:
        recommendations = generate_recommendations_from_ai(books_read)
    else:
        recommendations = generate_recommendations_from_ai()

    return jsonify({"bookRecommendations": recommendations})


if __name__ == '__main__':
    app.run(port = 5000, debug = True, host = '0.0.0.0')
