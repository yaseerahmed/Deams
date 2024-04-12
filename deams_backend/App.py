from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)

# Connect to the database
def connect_to_db():
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-C5SSQG8\SQLEXPRESS;DATABASE=ResourceAllocationDB;UID=BlueSQLAdmin2024;PWD=Str0ngP@ss#SSMS!')
    return conn

# Fetch user data from the database
def fetch_user(username):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    user = fetch_user(username)
    if not user or user.password != password:
        return jsonify({'error': 'Invalid username or password'}), 401

    # In a real application, you would generate a secure token here
    token = 'dummy_token'

    return jsonify({'token': token}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5003)
