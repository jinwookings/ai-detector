from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "").lower()

    probability = 20
    reasons = []

    if "결론적으로" in text:
        probability += 20
        reasons.append("AI가 자주 사용하는 표현 발견")

    if len(text) > 300:
        probability += 20
        reasons.append("문장이 매우 길고 일정함")

    if probability >= 60:
        result = "AI 생성 가능성이 높습니다."
    else:
        result = "사람이 작성했을 가능성이 높습니다."

    return jsonify({
        "result": result,
        "probability": probability,
        "reasons": reasons
    })

if __name__ == "__main__":
    app.run(debug=True)