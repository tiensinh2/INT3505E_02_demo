from flask import Blueprint, jsonify, request, make_response, url_for

bp = Blueprint("books_v4", __name__, url_prefix="/api/v4/books")

books = [
    {"id": 1, "title": "Clean Code", "author": "Robert C. Martin"},
    {"id": 2, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann"}
]

def find_book(book_id):
    return next((b for b in books if b["id"] == book_id), None)

@bp.route("/", methods=["GET"])
def list_books():
    response = make_response(jsonify({
        "data": books,
        "meta": {"count": len(books)},
        "links": {"self": url_for("books_v4.list_books")}
    }), 200)
    response.headers["Cache-Control"] = "public, max-age=120"
    return response

@bp.route("/<int:book_id>", methods=["GET"])
def retrieve_book(book_id):
    book = find_book(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({
        "data": book,
        "links": {"self": url_for("books_v4.retrieve_book", book_id=book_id)}
    }), 200

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
    return make_response(jsonify({
        "message": "Book created",
        "data": new_book,
        "links": {"self": url_for("books_v4.retrieve_book", book_id=new_book["id"])}
    }), 201)

@bp.route("/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    book = find_book(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    data = request.get_json()
    book.update({k: v for k, v in data.items() if k in ["title", "author"]})
    return jsonify({"message": "Updated", "data": book}), 200

@bp.route("/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    global books
    books = [b for b in books if b["id"] != book_id]
    return jsonify({"message": "Book deleted"}), 200
