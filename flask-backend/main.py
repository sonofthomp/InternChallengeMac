from flask import Flask, request, stream_with_context, Response
from dotenv import load_dotenv
import os
import anthropic

load_dotenv()

client = anthropic.Anthropic()
app = Flask(__name__)

def stream_resp_chunks(prompt):
    print('Prompt:', prompt)
    with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
        model="claude-3-5-sonnet-20241022",
    ) as stream:
        for text in stream.text_stream:
            yield text

# Major props to this guy: https://www.youtube.com/watch?v=6U6ognrmNsE
@app.route('/get_claude_resp', methods=['POST'])
def root():
    prompt = request.get_json()['prompt']

    def generate():
        for chunk in stream_resp_chunks(prompt):
            yield chunk

    return Response(stream_with_context(generate()))

if __name__ == '__main__':
    app.run(debug=True)