from dataclasses import dataclass

@dataclass
class Qa:
    id: str
    question: str
    answer: str

    def __str__(self):
        return f"{self.id} {self.question} {self.answer}"
