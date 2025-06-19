from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from imblearn.over_sampling import SMOTE
from datetime import datetime

app = Flask(__name__)

db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="serenitrack",
    port=3307,
    charset="utf8mb4",
    collation="utf8mb4_unicode_ci"
)

CORS(app)

cursor = db.cursor()
app.secret_key = 'key'
now = datetime.now()

@app.route('/api/send-input', methods=['POST'])
def receive_input():
    data       = request.get_json()
    username   = data.get('username')
    email      = data.get('email')
    password   = data.get('password')
    is_sign_up = data.get('isSignUp')

    cursor.execute("SELECT * FROM students WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if is_sign_up:
        if existing_user:
            return jsonify({'message': 'Duplicate email found'}), 409

        cursor.execute(
            "INSERT INTO students (name, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        db.commit()
        session['email'] = email
        return jsonify({
            'message': 'Account created successfully',
            'username': username,
            'email': email
        }), 200

    else:
        if not existing_user:
            return jsonify({'message': 'User not found'}), 404

        stored_password = existing_user[3]  # password index
        if password != stored_password:
            return jsonify({'message': 'Incorrect email or password'}), 401

        session['email'] = email
        return jsonify({
            'message': 'Login successful',
            'email': email
        }), 200

@app.route("/api/answers", methods=["POST"])
def answer():
    data = request.get_json()
    
    email = data.get("email")
    
    now = datetime.now()
    created_date = now.date()
    created_time = now.time()
    
    print("Email from login:", email)
    
    cursor.execute("SELECT MAX(version) FROM history WHERE email=%s", (email,))
    result = cursor.fetchone()
    
    if result[0] == None:
        version = 1
    else:
        version = result[0] + 1
    
    df = pd.read_csv("Stress Dataset.csv")
    
    selected_columns = [
        'Age',
        'Rapid Heartbeat',
        'Anxiety/Tension',
        'Sleep Issues',
        'Frequent Headaches',
        'Irritability',
        'Concentration Issues',
        'Sadness/Low Mood',
        'Loneliness/Isolation',
        'Weight Change'
    ]
    
    X = df[selected_columns]
    y = df["Type of Stress"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
    
    smote = SMOTE()
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
    
    model = RandomForestClassifier()
    model.fit(X_resampled, y_resampled)
    
    encoded_answers = data.get('answers')
    values = data.get('values')
    
    column_values = []
    
    for col in selected_columns:
        col_key = col.lower().replace(' ', '_').replace('/', '_')
        
        if col == 'Age':
            column_values.append(values.get('age'))
        else:
            column_values.append(values.get(col_key))
    
    temp_values = [email, version] + column_values + [created_date, created_time]
    
    cursor.execute(
        "INSERT INTO history (email, version, age, rapid_heartbeat, anxiety_tension, sleep_issues, frequent_headaches, irritability, concentration_issues, sadness_low_mood, loneliness_isolation, weight_change, created_date, created_time) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
        temp_values
    )
    
    db.commit()
    
    print("Values added to the database:", temp_values)
    
    input_data = []
    for val in encoded_answers.values():
        input_data.append(float(val))
    
    prediction = model.predict([input_data])
    
    high_values_columns = []
    
    for i in range(1, len(selected_columns)):
        value = int(input_data[i])
        
        if value > 3:
            high_values_columns.append(selected_columns[i] + ": " + str(value))
    
    if prediction[0] == 1:
        prediction_text = "Eustress (Moderate level)"
    elif prediction[0] == 2:
        prediction_text = "No Stress (0 or very low)"
    else:
        prediction_text = "Distress (Extremely high)"
    
    return jsonify({
        "message": "Success",
        "prediction_text": prediction_text,
        "high_values": high_values_columns
    }), 200
    
@app.route("/api/history", methods=["POST"])
def history():
    data = request.get_json()
    email = data.get("email")
    cursor.execute("SELECT * FROM history WHERE email = %s", (email,))
    result = cursor.fetchall()
    if not result:
        return jsonify({"message": "No records found"}), 404
    history_data = []
    column_names = [desc[0] for desc in cursor.description]
    for row in result:
        row_dict = dict(zip(column_names, row))
        if 'created_date' in row_dict and row_dict['created_date']:
            row_dict['created_date'] = row_dict['created_date'].strftime('%Y-%m-%d')
        if 'created_time' in row_dict and row_dict['created_time']:
            row_dict['created_time'] = str(row_dict['created_time'])
        history_data.append(row_dict)
    print("Row Dict:", history_data)
    return jsonify(history_data), 200

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    email = data.get("email")
    title = "Title"
    chatId = data.get("chatId")
    messages = data.get("messages")
    
    if messages:
        last_message = messages[-1]
        
        if (last_message["isUser"]):
            sender = "User"
        else:
            sender = "AI"
            
        cursor.execute("INSERT INTO chat1 (id, email, title, sender, content, time) VALUES (%s, %s, %s, %s, %s, %s)", (chatId, email, title, sender, last_message["content"], last_message["timestamp"]))
        
        db.commit()
                
        print("Messages:", last_message["content"])
        print("Sender:", last_message["isUser"])
        print("Time:", last_message["timestamp"])
    else:
        print("No messages found")
    
    return jsonify({"messages": messages}), 200

@app.route("/api/conversation", methods=["POST"])
def conversation():
    data = request.get_json()
    email = data.get("email")    
    chat_id = data.get("id")  # Retrieve ID from request

    cursor.execute("SELECT sender, content, time FROM chat1 WHERE email = %s AND id = %s ORDER BY time ASC", (email, chat_id))
    result = cursor.fetchall()

    if not result:
        return jsonify({"message": "No records found"}), 404

    conversation_data = [
        {
            "id": chat_id,
            "sender": row[0],
            "content": row[1],
            "timestamp": row[2].isoformat() if isinstance(row[2], datetime) else str(row[2])
        }
        for row in result
    ]

    return jsonify({"conversation": conversation_data}), 200

if __name__ == '__main__':
    app.run(port=5000)
