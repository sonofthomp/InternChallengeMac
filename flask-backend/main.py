from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
import json
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

api_key = os.environ.get('ANTHROPIC_API_KEY')

# Define the headers
headers = {
    'x-api-key': api_key,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
}

@app.route('/get_claude_resp', methods=['GET'])
def root():
    prompt = request.args['prompt']

    # Define the payload data
    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    # Send the POST request
    response = requests.post('https://api.anthropic.com/v1/messages', headers=headers, json=data)

    claude_resp_text = response.json()['content'][0]

    # Print the response
    return jsonify(claude_resp_text)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'yeet': 'chungus'})

if __name__ == '__main__':
    app.run(port=5003)