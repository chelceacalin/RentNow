from marshmallow import Schema, fields, post_load
from model.Book import Book


class BookSchema(Schema):
    title = fields.Str(required = True)
    category = fields.Str(required = True)

    @post_load
    def make_book(self, data, **kwargs):
        return Book(**data)
