from dataclasses import dataclass
from typing import Any


@dataclass
class Book:
    title: str
    category: str
    author: str

    def __str__(self):
        return f"{self.title} - {self.category} - {self.author}"

    @classmethod
    def from_dict(cls, obj: Any) -> 'Book':
        title = obj.get("title", "")
        category = obj.get("category", "")
        author = obj.get("author", "")
        return cls(title = title, category = category, author = author)
