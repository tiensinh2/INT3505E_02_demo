from flask import Blueprint, jsonify, make_response, request
from datetime import datetime

bp = Blueprint('books_v4', __name__, url_prefix='/api/v4/books')

books = [
    {"id": 1, "title": "Clean Code", "author": "Robert C. Martin"},
    {"id": 2, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann"}
]

@bp.route('/', methods=['GET'])
def get_books():
    resp = make_response(jsonify({
        "data": books,
        "meta": {"count": len(books), "timestamp": datetime.utcnow().isoformat()},
        "links": {"self": "/api/v4/books/"}
    }), 200)
    resp.headers["Cache-Control"] = "public, max-age=60"
    return resp

@bp.route('/', methods=['POST'])
def create_book():
    new_book = request.json
    new_book['id'] = len(books) + 1
    books.append(new_book)
    resp = make_response(jsonify({"message": "Created", "book": new_book}), 201)
    resp.headers["Cache-Control"] = "no-cache"
    return resp

@bp.route('/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    for b in books:
        if b['id'] == book_id:
            b.update(request.json)
            return jsonify({"message": "Updated", "book": b}), 200
    return jsonify({"error": "Book not found"}), 404

@bp.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [b for b in books if b['id'] != book_id]
    return jsonify({"message": f"Book {book_id} deleted"}), 200
