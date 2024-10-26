import json
import logging
import os
from typing import List

from marshmallow import ValidationError
from openai import OpenAI

from model.Book import Book
from model.BookSchema import BookSchema

logger = logging.getLogger(__name__)
client = OpenAI(
    api_key = os.environ.get("OPENAI_API_KEY"),
)


def generate_recommendations_from_ai(books_read = None, countRetries: int = 0) -> List[Book] | str:
    print("Books read: " + books_read if books_read else "No books read provided.")

    if books_read:
        prompt = f"Based on these books: {books_read}, what other books might the user like?"
    else:
        prompt = "What are some good books to recommend?"

    prompt = prompt + """Be sure to provide unique recommendations in each response, 
                     emphasizing creativity and diversity, but to be relevant to the input provided."""

    if countRetries >= 3:
        raise Exception("Max retries exceeded")

    response = client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages = [
            {"role": "system",
             "content":
                 """You are a creative assistant that provides book recommendations based on the user's reading 
                 history. Ensure that your answers vary even when the same input is provided. Each recommendation 
                 should be relevant, but feel free to introduce lesser-known or unconventional books to keep the 
                 suggestions fresh. Always include a diverse mix of genres, authors, and time periods.
                     
                     Return the results as a valid JSON array named 'bookRecommendations', formatted as follows:
                     """ + generateBooksFormat() + """Be sure to provide unique recommendations in each response, 
                     emphasizing creativity and diversity, but to be relevant to the input provided."""
             },
            {"role": "user", "content": prompt}
        ],
    )
    try:
        response = response.choices[0].message.content
        response_json = json.loads(response)
        book_recommendations = response_json.get('bookRecommendations')

        books: List[Book] = BookSchema(many = True).load(book_recommendations)
        return books
    except ValidationError as err:
        print(f"Error parsing JSON: {err}")
        return generate_recommendations_from_ai(books_read, countRetries + 1)
    except Exception as err:
        print(f"Error generating recommendations: {err}")
        return "Error generating custom recommendations"


def generateBooksFormat():
    return """
    [
    {
    "title": "TitleExample1",
    "category": "CategoryExample1",
    "author": "AuthorExample1"
    },
    {
    "title": "TitleExample2",
    "category": "CategoryExample2",
    "author": "AuthorExample2"
    },
     {
    "title": "TitleExample3",
    "category": "CategoryExample3",
    "author": "AuthorExample3"
    }
    ]
    """