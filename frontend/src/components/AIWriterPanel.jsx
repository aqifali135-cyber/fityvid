import { useEffect, useState } from 'react';
import {
  AI_LENGTHS,
  AI_TONES,
  generateAiWriterOutput,
  getAiWriterTool,
} from '../utils/aiWriterTemplates';
import './AIWriterPanel.css';

export default function AIWriterPanel({ toolId, onClose }) {
  const tool = getAiWriterTool(toolId);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTopic('');
    setTone('Professional');
    setLength('Medium');
    setOutput('');
    setError('');
    setCopied(false);
  }, [toolId]);

  if (!tool) return null;

  function handleGenerate(e) {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic or keyword first.');
      setOutput('');
      return;
    }
    setError('');
    const result = generateAiWriterOutput({
      toolId: tool.id,
      topic,
      tone,
      length,
    });
    setOutput(result);
    setCopied(false);
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  function handleClear() {
    setTopic('');
    setOutput('');
    setError('');
    setCopied(false);
  }

  return (
    <section id="ai-writer-panel" className="ai-writer-panel-section">
      <div className="container">
        <div className="ai-writer-panel card">
          <div className="ai-writer-panel__head">
            <div>
              <p className="ai-writer-panel__eyebrow">AI Writer · {tool.groupLabel}</p>
              <h2 className="ai-writer-panel__title">{tool.title}</h2>
              <p className="ai-writer-panel__subtitle">
                Enter a topic and generate useful text instantly. This is a frontend demo using
                smart templates (no external AI API yet).
              </p>
            </div>
            <button type="button" className="btn btn-secondary ai-writer-panel__close" onClick={onClose}>
              Close
            </button>
          </div>

          <form className="ai-writer-panel__form" onSubmit={handleGenerate}>
            <div className="ai-writer-panel__field ai-writer-panel__field--full">
              <label htmlFor="ai-writer-topic" className="label">
                Topic / keyword / text
              </label>
              <textarea
                id="ai-writer-topic"
                className="textarea ai-writer-panel__topic"
                placeholder="Type your topic or paste text here..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
            </div>

            <div className="ai-writer-panel__field">
              <label htmlFor="ai-writer-tone" className="label">
                Tone
              </label>
              <select
                id="ai-writer-tone"
                className="select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {AI_TONES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="ai-writer-panel__field">
              <label htmlFor="ai-writer-length" className="label">
                Length
              </label>
              <select
                id="ai-writer-length"
                className="select"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                {AI_LENGTHS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="ai-writer-panel__actions">
              <button type="submit" className="btn btn-primary">
                Generate
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </form>

          {error && <p className="error-text ai-writer-panel__error">{error}</p>}

          <div className="ai-writer-panel__output-wrap">
            <label htmlFor="ai-writer-output" className="label">
              Output
            </label>
            <textarea
              id="ai-writer-output"
              className="textarea ai-writer-panel__output"
              value={output}
              readOnly
              placeholder="Your generated text will appear here..."
              rows={12}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
