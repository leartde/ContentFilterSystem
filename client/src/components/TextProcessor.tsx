import ProcessText from "../services/ProcessText.ts";
import { useState } from "react";
import { COLOR_STYLES } from "../utils/colors.ts";

type ColorName = keyof typeof COLOR_STYLES;
type Match = {
  text: string;
  highlightColor: ColorName | null;
  tagText: string | null;
};


const normalizeWord = (value: string): string =>
  value.toLowerCase().replace(/[^\w]/g, "");

const TextProcessor = () => {
  const [input, setInput] = useState('');
  const [matchesByWord, setMatchesByWord] = useState<Record<string, Match>>({});

  const handleProcessText = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const response: Match[] = await ProcessText(input);
    const mapped: Record<string, Match> = {};

    response.forEach((match) => {
      const normalized = normalizeWord(match.text);
      if (!normalized) return;

      const color = match.highlightColor?.trim() as ColorName | "";
      mapped[normalized] = {
        text: match.text,
        highlightColor: color && color in COLOR_STYLES ? color : null,
        tagText: match.tagText?.trim() || null,
      };
    });

    setMatchesByWord(mapped);
  };

  const tokens = input.split(/(\s+)/);

  return (
    <>
      <form onSubmit={handleProcessText}>
        <textarea
          onChange={e => setInput(e.target.value)}
          value={input}
          className="w-full h-40 p-2 border rounded-md"
          placeholder="Enter text to process..."
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
        >
          Process Text
        </button>
      </form>

      <h2 className="mt-2 text-md font-semibold text-gray-900/80">Processed Output:</h2>
      <div className="max-h-64 overflow-y-auto p-4 border rounded-md bg-gray-100">
        <p className="leading-8 wrap-break-word">
          {tokens.map((token, index) => {
            if (/^\s+$/.test(token)) {
              return <span key={`space-${index}`}>{token}</span>;
            }

            const normalized = normalizeWord(token);
            const match = matchesByWord[normalized]

            if (!match) {
              return <span key={`plain-${index}`}>{token}</span>;
            }

            return (
              <span
                key={`match-${index}`}
                className="rounded px-1"
                style={
                  match.highlightColor
                    ? { backgroundColor: COLOR_STYLES[match.highlightColor] }
                    : undefined
                }
                title={match.tagText ?? undefined}
              >
                {token}
                {match.tagText && (
                  <span className="text-xs font-bold bg-yellow-200/80 px-1 py-0.5 rounded ml-1 text-gray-700">
                    [{match.tagText}]
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </>
  );
};

export default TextProcessor;
