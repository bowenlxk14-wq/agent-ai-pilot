import { useState } from "react";

const audienceOptions = [
  "New immigrant families",
  "Financially anxious middle class",
  "Young parents",
  "Business owners",
  "Pre-retirees (55+)"
];

export default function Content() {
  const [targetAudience, setTargetAudience] = useState(audienceOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3001/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAudience })
      });
      if (!response.ok) {
        throw new Error("Unable to generate content.");
      }
      const data = await response.json();
      setOutput(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-display text-3xl">Content Engine</h2>
        <p className="text-ink-500 text-base">
          Generate warm, human social content tailored to your audience.
        </p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-5">
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
            Who are you targeting today?
          </label>
          <select
            value={targetAudience}
            onChange={(event) => setTargetAudience(event.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
          >
            {audienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="h-12 px-5 rounded-xl bg-ink-900 text-white text-base font-medium disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>

      {output && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
            <div>
              <h3 className="font-display text-xl">Headline Ideas</h3>
              <p className="text-sm text-ink-500">3 punchy options</p>
            </div>
            <ul className="space-y-3 text-base">
              {output.headlines.map((headline) => (
                <li key={headline} className="p-3 rounded-xl bg-sand-50">
                  {headline}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => copyToClipboard(output.headlines.join("\n"))}
              className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
            <div>
              <h3 className="font-display text-xl">Post Copy</h3>
              <p className="text-sm text-ink-500">100–150 words</p>
            </div>
            <div className="p-4 rounded-xl bg-sand-50 text-base leading-relaxed">
              {output.postCopy}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(output.postCopy)}
              className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
            <div>
              <h3 className="font-display text-xl">Call to Action</h3>
              <p className="text-sm text-ink-500">Ends with a soft push</p>
            </div>
            <div className="p-4 rounded-xl bg-sand-50 text-base leading-relaxed">
              {output.cta}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(output.cta)}
              className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
