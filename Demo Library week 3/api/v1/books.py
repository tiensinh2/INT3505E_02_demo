from flask import Blueprint, jsonify, request

bp = Blueprint("books_v1", __name__, url_prefix="/api/v1/books")

books = [
    {"id": 1, "title": "Python Crash Course"},
    {"id": 2, "title": "Automate the Boring Stuff"}
]

@bp.route("/", methods=["GET"])
def get_all_books():
    return jsonify(books)

@bp.route("/<int:book_id>", methods=["GET"])
def get_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    return jsonify(book or {"error": "Book not found"})

@bp.route("/", methods=["POST"])
def create_book():
    data = request.get_json()
    new_book = {"id": len(books) + 1, "title": data["title"]}
    books.append(new_book)
    return jsonify(new_book), 201

@bp.route("/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.get_json()
    for b in books:
        if b["id"] == book_id:
            b.update(data)
            return jsonify(b)
    return jsonify({"error": "Book not found"}), 404

@bp.route("/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    global books
    books = [b for b in books if b["id"] != book_id]
    return jsonify({"message": "Book deleted"})
