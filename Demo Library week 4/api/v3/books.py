from flask import Blueprint, jsonify, request
import jwt, datetime

bp = Blueprint('books_v3', __name__, url_prefix='/api/v3/books')
SECRET_KEY = "supersecret"

books = [
    {"id": 1, "title": "Clean Code", "author": "Robert C. Martin"},
    {"id": 2, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann"}
]

def verify_token():
    token = request.headers.get('Authorization')
    if not token:
        return None, jsonify({"error": "Missing token"}), 401
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({"error": "Invalid token"}), 401

@bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    token = jwt.encode({
        'user': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token})

@bp.route('/', methods=['GET'])
def get_books():
    _, error, code = verify_token()
    if error: return error, code
    return jsonify({"data": books, "meta": {"count": len(books)}})

@bp.route('/', methods=['POST'])
def create_book():
    _, error, code = verify_token()
    if error: return error, code
    new_book = request.json
    new_book['id'] = len(books) + 1
    books.append(new_book)
    return jsonify(new_book), 201

@bp.route('/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    _, error, code = verify_token()
    if error: return error, code
    for b in books:
        if b['id'] == book_id:
            b.update(request.json)
            return jsonify(b)
    return jsonify({'error': 'Book not found'}), 404

@bp.route('/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    _, error, code = verify_token()
    if error: return error, code
    global books
    books = [b for b in books if b['id'] != book_id]
    return jsonify({'message': f'Book {book_id} deleted'})
