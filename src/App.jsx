import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("text");

  const analyzeContent = async () => {
    try {
      const response = await fetch("https://ai-detector-api-fi1s.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          type: mode,
        }),
      });

      const data = await response.json();

      setResult({
        verdict: data.result,
        probability: data.probability,
        reasons: data.reasons,
      });
    } catch (error) {
      console.error(error);

      setResult({
        verdict: "서버 연결 실패",
        probability: 0,
        reasons: ["Flask 서버가 실행 중인지 확인하세요."],
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <h1>AI 뉴스 및 텍스트 판별기</h1>

      <p>
      텍스트 또는 뉴스 기사 URL을 입력하세요.
      입력된 내용 또는 기사 본문을 분석하여 AI 생성 가능성을 판단합니다.
      </p>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setMode("text")}>글 분석</button>
        <button onClick={() => setMode("news")}>뉴스 분석</button>
        <button onClick={() => setMode("image")}>이미지 분석</button>
      </div>

      <textarea
        rows="8"
        cols="60"
        placeholder="내용 또는 링크를 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />
      <br />

      <button onClick={analyzeContent}>AI 분석 시작</button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>분석 결과</h2>

          <h3>{result.verdict}</h3>

          <p>
            <strong>AI 생성 확률:</strong> {result.probability}%
          </p>

          <h4>탐지 근거</h4>

          <ul
            style={{
              textAlign: "left",
              display: "inline-block",
            }}
          >
            {result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;