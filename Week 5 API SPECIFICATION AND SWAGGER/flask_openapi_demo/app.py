from flask import Flask, jsonify, request
from flask_swagger_ui import get_swaggerui_blueprint
from models.data import BOOKS

app = Flask(__name__)

# Swagger UI setup
SWAGGER_URL = '/apidocs'
API_URL = '/static/books_api.yaml'  # URL tĩnh YAML
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Books API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# === API endpoints ===
@app.route('/api/v1/books', methods=['GET'])
def get_books():
    return jsonify(BOOKS)

@app.route('/api/v1/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = next((b for b in BOOKS if b["id"] == book_id), None)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(book)

@app.route('/api/v1/books', methods=['POST'])
def create_book():
    data = request.get_json(force=True)
    new_book = {
        "id": len(BOOKS) + 1,
        "title": data.get("title"),
        "author": data.get("author"),
    }
    BOOKS.append(new_book)
    return jsonify(new_book), 201

@app.route('/api/v1/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json(force=True)
    for b in BOOKS:
        if b["id"] == book_id:
            b["title"] = data.get("title", b["title"])
            b["author"] = data.get("author", b["author"])
            return jsonify(b), 200
    return jsonify({"error": "Book not found"}), 404

@app.route('/api/v1/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global BOOKS
    BOOKS = [b for b in BOOKS if b["id"] != book_id]
    return jsonify({"message": "Book deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
