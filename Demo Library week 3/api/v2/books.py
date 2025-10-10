from flask import Blueprint, jsonify, request

bp = Blueprint("books_v2", __name__, url_prefix="/api/v2/books")

books = [
    {"id": 1, "title": "Fluent Python"},
    {"id": 2, "title": "Hands-On Machine Learning"}
]

@bp.route("/", methods=["GET"])
def list_books():
    return jsonify({"data": books}), 200

@bp.route("/<int:book_id>", methods=["GET"])
def retrieve_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(book), 200

@bp.route("/", methods=["POST"])
def create_book():
    data = request.get_json()
    if not data or "title" not in data:
        return jsonify({"error": "Missing title"}), 400
    new_book = {"id": len(books) + 1, "title": data["title"]}
    books.append(new_book)
    return jsonify(new_book), 201

@bp.route("/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.get_json()
    book = next((b for b in books if b["id"] == book_id), None)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    book.update({"title": data.get("title", book["title"])})
    return jsonify(book), 200

@bp.route("/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    global books
    books = [b for b in books if b["id"] != book_id]
    return jsonify({"message": "Book deleted"}), 200
