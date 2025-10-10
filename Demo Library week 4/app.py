from flask import Flask, jsonify

# Import các phiên bản API
from api.v1.books import bp as books_v1
from api.v2.books import bp as books_v2
from api.v3.books import bp as books_v3
from api.v4.books import bp as books_v4


def create_app():
    app = Flask(__name__)

    # Đăng ký blueprint theo version
    app.register_blueprint(books_v1, url_prefix="/api/v1/books")
    app.register_blueprint(books_v2, url_prefix="/api/v2/books")
    app.register_blueprint(books_v3, url_prefix="/api/v3/books")
    app.register_blueprint(books_v4, url_prefix="/api/v4/books")

    @app.route("/")
    def index():
        return jsonify({
            "project": "Library Management REST API",
            "versions": {
                "v1": "/api/v1/books",
                "v2": "/api/v2/books",
                "v3": "/api/v3/books",
                "v4": "/api/v4/books"
            },
            "info": "Each version demonstrates a higher REST maturity level."
        })

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
