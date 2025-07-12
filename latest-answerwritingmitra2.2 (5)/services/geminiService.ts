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
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("The response body is empty.");
    }
    
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      onStream(value);
    }

  } catch (err) {
    console.error("API Call Error:", err);
    if (err instanceof Error) {
        onError(err);
    } else {
        onError(new Error('An unknown error occurred during the API call.'));
    }
  } finally {
    onEnd();
  }
}
