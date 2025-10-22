from fastapi import FastAPI, Query
from typing import Optional

app = FastAPI(title="Library API")

# Dữ liệu giả lập (mock data)
books_db = [
    {"id": "b001", "title": "Harry Potter and the Sorcerer's Stone", "author": "J.K. Rowling"},
    {"id": "b002", "title": "Harry Potter and the Chamber of Secrets", "author": "J.K. Rowling"},
    {"id": "b003", "title": "The Hobbit", "author": "J.R.R. Tolkien"},
    {"id": "b004", "title": "1984", "author": "George Orwell"},
    {"id": "b005", "title": "Animal Farm", "author": "George Orwell"},
    {"id": "b006", "title": "Harry Potter and the Prisoner of Azkaban", "author": "J.K. Rowling"},
    {"id": "b007", "title": "The Lord of the Rings", "author": "J.R.R. Tolkien"},
    {"id": "b008", "title": "To Kill a Mockingbird", "author": "Harper Lee"},
]

@app.get("/books")
def get_books(
    title: Optional[str] = Query(None, description="Tìm theo tên sách"),
    author: Optional[str] = Query(None, description="Tìm theo tác giả"),
    limit: int = Query(5, ge=1),
    offset: int = Query(0, ge=0)
):
    results = books_db
    if title:
        results = [b for b in results if title.lower() in b["title"].lower()]
    if author:
        results = [b for b in results if author.lower() in b["author"].lower()]

    total = len(results)
    paginated = results[offset:offset + limit]

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "books": paginated
    }

@app.get("/books/{book_id}")
def get_book_detail(book_id: str):
    book = next((b for b in books_db if b["id"] == book_id), None)
    if not book:
        return {"error": "Book not found"}
    return book
### link: http://127.0.0.1:8000/docs