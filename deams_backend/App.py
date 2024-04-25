from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
from datetime import datetime, timedelta
import base64

app = Flask(__name__)
CORS(app)

# Connect to the database
def connect_to_db():
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-C5SSQG8\SQLEXPRESS;DATABASE=ResourceAllocationDB;UID=BlueSQLAdmin2024;PWD=B3tter@w0rk')
    return conn

# Fetch user data from the database
def fetch_user(username):
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user

# Generate custom token
def generate_token(username, role):
    # Set token expiration time
    expiration_time = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour

    # Construct token data as a dictionary
    token_data = {
        'username': username,
        'role': role,
        'exp': expiration_time.strftime('%Y-%m-%d %H:%M:%S')  # Format expiration time as string
    }

    # Serialize token data to a JSON-like string
    token_string = f"{token_data['username']}|{token_data['role']}|{token_data['exp']}"

    # Encode the token string as base64
    encoded_token = base64.b64encode(token_string.encode('utf-8')).decode('utf-8')

    return encoded_token
@app.route('/validate_token', methods=['POST'])
def validate_token():
    # Retrieve the token from the request payload
    token_payload = request.json.get('token')

    if not token_payload:
        return jsonify({'error': 'No token provided'}), 401

    try:
        # Decode the token payload from base64
        decoded_token = base64.b64decode(token_payload).decode('utf-8')
        # Split the decoded token into its components (username, role, expiration time)
        username, role, exp_str = decoded_token.split('|')
        # Convert the expiration time string to a datetime object
        expiration_time = datetime.strptime(exp_str, '%Y-%m-%d %H:%M:%S')

        # Check if the token is expired
        if expiration_time < datetime.utcnow():
            return jsonify({'error': 'Token expired'}), 401

        # Perform additional checks based on your application's requirements
        # For example, check if the user's role has access to a specific resource

        # Return a response indicating the token is valid
        return jsonify({'username': username, 'role': role}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Invalid token'}), 401


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

    # Assuming 'role' is a column in your 'users' table
    user_role = user.role  # Assuming the column name is 'role'

    # Generate custom token
    token = generate_token(username, user_role)

    return jsonify({'token': token, 'role': str(user_role)}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5003)
