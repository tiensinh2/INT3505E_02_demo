class BookRepository:
    def __init__(self):
        self.books = [
            {"id": 1, "title": "Fluent Python"},
            {"id": 2, "title": "Machine Learning for Finance"}
        ]

    def get_all(self):
        return self.books

    def get_by_id(self, book_id):
        return next((b for b in self.books if b["id"] == book_id), None)

    def add(self, title):
        new_book = {"id": len(self.books)+1, "title": title}
        self.books.append(new_book)
        return new_book

    def delete(self, book_id):
        self.books = [b for b in self.books if b["id"] != book_id]
