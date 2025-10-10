from flask import Blueprint, jsonify, request

bp = Blueprint('books_v1', __name__, url_prefix='/api/v1/books')

books = [
    {"id": 1, "title": "Clean Code", "author": "Robert C. Martin"},
    {"id": 2, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann"}
]

@bp.route('/', methods=['GET'])
def get_books():
    return jsonify(books)

@bp.route('/', methods=['POST'])
def add_book():
    new_book = request.json
    new_book['id'] = len(books) + 1
    books.append(new_book)
    return jsonify(new_book), 201

@bp.route('/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    for b in books:
        if b['id'] == book_id:
            b.update(request.json)
            return jsonify(b)
    return jsonify({'error': 'Book not found'}), 404

@bp.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [b for b in books if b['id'] != book_id]
    return jsonify({'message': f'Book {book_id} deleted'})
