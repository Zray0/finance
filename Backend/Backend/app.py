from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import os

# Ensure UTF-8 encoding
os.environ['PYTHONIOENCODING'] = 'utf-8'

app = Flask(__name__)
CORS(app)

# Load the LSTM model
model = load_model('lstm_expense_forecaster.h5')

@app.route('/predict', methods=['POST'])  # POST request
def predict():
    try:
        # Get JSON data from the request
        data = request.json
        print(f"Received data: {data}")  # Log input for debugging

        # Validate the input data
        if 'sequence' not in data or not isinstance(data['sequence'], list):
            return jsonify({'error': 'Invalid input format. Expected a JSON with a "sequence" field.'}), 400

        # Convert sequence to numpy array and reshape for LSTM model
        sequence = np.array(data['sequence'], dtype=float).reshape(1, -1)

        # Make a prediction
        prediction = model.predict(sequence)
        predicted_value = float(prediction[0][0])  # Convert to float

        # Add 40 to the predicted value
        adjusted_predicted_value = predicted_value + 40
        print(f"Adjusted Prediction: {adjusted_predicted_value}")  # Log adjusted prediction for debugging

        return jsonify({'predictedValue': adjusted_predicted_value})
    except Exception as e:
        print(f"Error: {str(e)}")  # Log error for debugging
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
