from flask import Blueprint, jsonify, request, make_response
from functools import lru_cache

bp = Blueprint("books_v3", __name__, url_prefix="/api/v3/books")

books = [
    {"id": 1, "title": "Fluent Python", "author": "Luciano Ramalho"},
    {"id": 2, "title": "Hands-On Machine Learning", "author": "Aurélien Géron"}
]

@lru_cache(maxsize=32)
def cached_books():
    return tuple(books)

@bp.route("/", methods=["GET"])
def get_books():
    response = make_response(jsonify(list(cached_books())), 200)
    response.headers["Cache-Control"] = "public, max-age=60"
    response.headers["X-Layer"] = "API Gateway > Business Logic > Database"
    return response

@bp.route("/<int:book_id>", methods=["GET"])
def get_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    response = make_response(jsonify(book), 200)
    response.headers["Cache-Control"] = "public, max-age=60"
    return response

@bp.route("/", methods=["POST"])
def create_book():
    data = request.get_json()
    if not data or "title" not in data:
        return jsonify({"error": "Invalid input"}), 400
    new_book = {
        "id": len(books) + 1,
        "title": data["title"],
        "author": data.get("author", "Unknown")
    }
    books.append(new_book)
    cached_books.cache_clear()
    return jsonify(new_book), 201

@bp.route("/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.get_json()
    for b in books:
        if b["id"] == book_id:
            b.update(data)
            cached_books.cache_clear()
            return jsonify(b)
    return jsonify({"error": "Book not found"}), 404

@bp.route("/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    global books
    books = [b for b in books if b["id"] != book_id]
    cached_books.cache_clear()
    return jsonify({"message": "Book deleted"}), 200
