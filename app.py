from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)
DB = "database.db"

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/books")
def books():
    conn = get_db()
    rows = conn.execute("SELECT * FROM books").fetchall()
    conn.close()
    return render_template("books.html", books=rows)

@app.route("/add_book", methods=["POST"])
def add_book():
    title = request.form["title"]
    author = request.form["author"]
    conn = get_db()
    conn.execute("INSERT INTO books(title, author, available) VALUES(?,?,1)", (title, author))
    conn.commit()
    conn.close()
    return redirect(url_for("books"))

@app.route("/borrow/<int:book_id>")
def borrow(book_id):
    conn = get_db()
    conn.execute("UPDATE books SET available=0 WHERE id=?", (book_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("books"))

@app.route("/return/<int:book_id>")
def return_book(book_id):
    conn = get_db()
    conn.execute("UPDATE books SET available=1 WHERE id=?", (book_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("books"))

if __name__ == "__main__":
    app.run(debug=True)
