import json
import os
from typing import List, Optional, Union

from marshmallow import ValidationError
from openai import OpenAI

from config.logger_config import logger
from model.Book import Book
from model.BookSchema import BookSchema

client = OpenAI(
    api_key = os.environ.get("OPENAI_API_KEY"),
)


def create_prompt(books_read: Optional[str]) -> str:
    if books_read:
        prompt = f"Based on these books: {books_read}, what other books might the user like?"
    else:
        prompt = "What are some good books to recommend?"
    prompt += """
        Be sure to provide unique recommendations in each response, 
        emphasizing creativity and diversity, but staying relevant to the input provided.
    """
    return prompt


def call_openai(prompt: str) -> Union[str, None]:
    try:
        response = client.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = [
                {"role": "system", "content": "You are a creative assistant that provides book recommendations."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error calling OpenAI API: {e}")
        return None


def parse_response(response: str) -> Union[List[Book], str]:
    try:
        response_json = json.loads(response)
        book_recommendations = response_json.get("bookRecommendations")
        books = BookSchema(many = True).load(book_recommendations)
        return books
    except ValidationError as err:
        logger.error(f"Error parsing JSON: {err}")
        return "Error parsing response JSON"
    except Exception as err:
        logger.error(f"Unexpected error parsing response: {err}")
        return "Error generating custom recommendations"


def generate_recommendations_from_ai(books_read: Optional[str] = None, retry_count: int = 0) -> Union[List[Book], str]:
    if retry_count >= 3:
        logger.error("Max retries exceeded")
        return "Max retries exceeded"

    prompt = create_prompt(books_read)
    response = call_openai(prompt)

    if response:
        return parse_response(response)
    else:
        logger.warning("Retrying API call...")
        return generate_recommendations_from_ai(books_read, retry_count + 1)
