import json
from typing import List, Optional, Union
from marshmallow import ValidationError
from transformers import AutoModelForCausalLM, AutoTokenizer
import re

from config.logger_config import logger
from model.Book import Book
from model.BookSchema import BookSchema

# Initialize the tokenizer and model
model_name = "distilgpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token
model = AutoModelForCausalLM.from_pretrained(model_name)


def create_prompt(books_read: Optional[str]) -> str:
    example_answer = """
    [
        {"title": "Pride and Prejudice", "category": "Classic Literature"},
        {"title": "1984", "category": "Dystopian Fiction"},
        {"title": "To Kill a Mockingbird", "category": "Modern Classics"}
    ]
    """

    if books_read:
        prompt = f"Based on these books: {books_read}, suggest three other books the user might like in JSON format."
    else:
        prompt = "Suggest three popular books that might interest the user in JSON format."

    prompt += f"""
    Please return structured data in the following JSON format, with three unique book recommendations:
    {example_answer}
    Do not return any other text or explanation, just the valid JSON data.
    """
    return prompt


def generate_recommendations_from_ai(books_read: Optional[str] = None, retry_count: int = 0) -> Union[List[Book], str]:
    if retry_count >= 3:
        logger.error("Max retries exceeded")
        return "Max retries exceeded"

    prompt = create_prompt(books_read)
    response = call_local_model(prompt)

    if response:
        return parse_response(response)
    else:
        logger.warning("Retrying local model generation...")
        return generate_recommendations_from_ai(books_read, retry_count + 1)


def call_local_model(prompt: str) -> Union[str, None]:
    try:
        inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
        outputs = model.generate(
            inputs.input_ids,
            max_new_tokens=150,
            attention_mask=inputs.attention_mask,
            pad_token_id=tokenizer.eos_token_id
        )

        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print("response text \n", response_text)
        return response_text
    except Exception as e:
        logger.error(f"Error generating recommendations with local model: {e}")
        return None


def parse_response(response: str) -> Union[List['Book'], str]:
    try:
        # Attempt JSON parsing directly
        response_json = json.loads(response)
        if isinstance(response_json, list) and all("title" in item and "category" in item for item in response_json):
            books = BookSchema(many=True).load(response_json)
            return books
        else:
            logger.error("Invalid JSON format received")
            return "Error: JSON format does not match expected structure"

    except (json.JSONDecodeError, ValidationError):
        logger.warning("Parsing failed, attempting regex extraction.")

        # Regex to extract book titles and categories
        pattern = r'\{\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"\s*\}'
        matches = re.findall(pattern, response)

        # Build list of recommendations from extracted data
        recommendations = [{"title": title, "category": category} for title, category in matches]

        if recommendations:
            try:
                books = BookSchema(many=True).load(recommendations)
                return books
            except ValidationError as err:
                logger.error(f"Error validating recommendations: {err}")
                return "Error: Recommendations do not match expected structure"

        logger.error("No valid recommendations found in response.")
        return "Error: No valid recommendations found in response."


def call_openai_api_like(prompt: str) -> str:
    # Mimics an API call to OpenAI, but using the local model instead
    try:
        inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
        outputs = model.generate(
            inputs.input_ids,
            max_new_tokens=150,
            attention_mask=inputs.attention_mask,
            pad_token_id=tokenizer.eos_token_id
        )

        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response_text
    except Exception as e:
        logger.error(f"Error while calling the local model: {e}")
        return "Error"


# Update the call to reflect OpenAI-style response
def generate_recommendations_using_local_model(books_read: Optional[str] = None) -> Union[List[Book], str]:
    prompt = create_prompt(books_read)
    response = call_openai_api_like(prompt)
    return parse_response(response)
