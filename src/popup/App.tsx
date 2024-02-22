import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [patterns, setPatterns] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const { patterns } = await chrome.storage.local.get("patterns");
      if (patterns) {
        setPatterns(patterns);
      }
    })();
  }, []);
  const [input, setInput] = useState<string>("");
  const addPattern = () => {
    if (input === "") {
      return;
    }
    setPatterns([...patterns, input]);
    chrome.storage.local.set({ patterns: [...patterns, input] });
  };
  const handleDelete = (pattern: string) => {
    setPatterns(patterns.filter((p) => p !== pattern));
    chrome.storage.local.set({
      patterns: patterns.filter((p) => p !== pattern),
    });
  };
  return (
    <div>
      <ul>
        {patterns.map((pattern) => (
          <li key={pattern}>
            {pattern}
            <button type="button" onClick={() => handleDelete(pattern)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={addPattern}>
        <input type="text" onChange={(e) => setInput(e.target.value)} />
        <button
          type="submit"
          disabled={patterns.includes(input) || input.length === 0}
        >
          追加
        </button>
      </form>
    </div>
  );
}

export default App;
