from repository.books_repo import BookRepository

class BookService:
    def __init__(self):
        self.repo = BookRepository()

    def get_all_books(self):
        return self.repo.get_all()

    def get_book(self, book_id):
        return self.repo.get_by_id(book_id)

    def add_book(self, title):
        return self.repo.add(title)

    def delete_book(self, book_id):
        return self.repo.delete(book_id)
