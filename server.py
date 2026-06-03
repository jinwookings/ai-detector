from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def get_article_text(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers, timeout=10)

        soup = BeautifulSoup(response.text, "html.parser")

        paragraphs = soup.find_all("p")

        text = " ".join([p.get_text() for p in paragraphs])

        return text

    except Exception:
        return ""

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json
    user_input = data.get("text", "").strip()

    if user_input.startswith("http://") or user_input.startswith("https://"):
        text = get_article_text(user_input)
    else:
        text = user_input

    text = text.lower()

    probability = 20
    reasons = []

    if "결론적으로" in text:
        probability += 20
        reasons.append("AI가 자주 사용하는 표현 발견")

    if len(text) > 300:
        probability += 20
        reasons.append("문장이 길고 일정함")

    if len(text) > 1000:
        probability += 20
        reasons.append("매우 긴 문장 구조")

    probability = min(probability, 100)

    if probability >= 60:
        result = "AI 생성 가능성이 높습니다."
    else:
        result = "사람이 작성했을 가능성이 높습니다."

    return jsonify({
        "result": result,
        "probability": probability,
        "reasons": reasons,
        "analyzed_length": len(text)
    })

if __name__ == "__main__":
    app.run(debug=True)