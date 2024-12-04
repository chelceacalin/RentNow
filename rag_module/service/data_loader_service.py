import json
import os
from model.Qa import Qa
from service.chroma_service import add_qa_to_collection, qa_collection
from config.logger_config import logger


def load_initial_data(path: str):
    logger.info("Start loading initial data")
    try:
        with open(path, "r", encoding = "utf-8") as file:
            data = json.load(file)

        for item in data:
            qa_id = item.get("id")
            question = item.get("question")
            answer = item.get("answer")

            existing_entry = qa_collection.get(where = {"id": qa_id})
            if not existing_entry["ids"]:
                qa = Qa(id = qa_id, question = question, answer = answer)
                add_qa_to_collection(qa)
        logger.info("Loaded initial data successfully for path {}".format(path))

    except Exception as e:
        logger.error("Error loading file from path {0}".format(path))


def load_data():
    print("Loadingg date")
    script_dir = os.path.dirname(__file__)
    load_initial_data(os.path.join(script_dir, "data/implicit_qa_en.json"))
