
import type { EvaluationConfig } from "../types";

export async function evaluateAnswerStream(
  config: EvaluationConfig,
  answer: string,
  onStream: (chunk: string) => void,
  onError: (error: Error) => void,
  onEnd: () => void
) {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config, answer }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response stream not available.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let streaming = true;
    while (streaming) {
      const { done, value } = await reader.read();
      if (done) {
        streaming = false;
        break;
      }
      onStream(decoder.decode(value, { stream: true }));
    }

  } catch (err) {
    console.error("Evaluation service error:", err);
    if (err instanceof Error) {
        onError(err);
    } else {
        onError(new Error('An unknown error occurred.'));
    }
  } finally {
    onEnd();
  }
}
