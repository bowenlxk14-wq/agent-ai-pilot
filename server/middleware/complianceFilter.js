const forbiddenPhrases = [
  "100% payout",
  "100% 赔付",
  "lowest premium in the US",
  "全美最低保费",
  "guaranteed returns",
  "保证收益",
  "official insurer statement",
  "保险公司官方声明"
];

const predictiveTriggers = [
  "will pay out",
  "definitely covered",
  "guaranteed",
  "always approved"
];

export default function complianceFilter(text) {
  if (!text) return text;
  let cleanedText = text;
  let violationFound = false;

  forbiddenPhrases.forEach((phrase) => {
    const regex = new RegExp(phrase, "gi");
    if (regex.test(cleanedText)) {
      violationFound = true;
      cleanedText = cleanedText.replace(regex, "[REMOVED - compliance violation]");
    }
  });

  if (violationFound) {
    console.log(
      `[Compliance] ${new Date().toISOString()} - Forbidden phrase removed`
    );
  }

  const triggerRegex = new RegExp(predictiveTriggers.join("|"), "i");
  if (triggerRegex.test(cleanedText)) {
    cleanedText = `${cleanedText} (Note: Actual coverage is subject to underwriting and policy terms.)`;
  }

  return cleanedText;
}
