from dataclasses import dataclass
from typing import Any


@dataclass
class Book:
    title: str
    category: str

    def __str__(self):
        return f"{self.title} - {self.category} \n"

    @classmethod
    def from_dict(cls, obj: Any) -> 'Book':
        title = obj.get("title", "")
        category = obj.get("category", "")
        return cls(title = title, category = category)
