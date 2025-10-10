from flask import Blueprint, jsonify, request

bp = Blueprint('books_v2', __name__, url_prefix='/api/v2/books')

books = [
    {"id": 1, "title": "Clean Code", "author": "Robert C. Martin"},
    {"id": 2, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann"}
]

@bp.route('/', methods=['GET'])
def get_books():
    return jsonify({"data": books, "meta": {"count": len(books)}}), 200

@bp.route('/', methods=['POST'])
def create_book():
    new_book = request.json
    new_book['id'] = len(books) + 1
    books.append(new_book)
    return jsonify({"message": "Created", "book": new_book}), 201

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
