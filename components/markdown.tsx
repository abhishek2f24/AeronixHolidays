import { cn } from "@/lib/utils";

/** Lightweight markdown-to-JSX renderer for Odin AI chat bubbles.
 *  Handles: headings, bold, italic, code, bullet lists, numbered lists, line breaks.
 */
export function MarkdownText({ content, className }: { content: string; className?: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listBuffer.length === 0) return;
    const items = listBuffer.map((item, i) => (
      <li key={i} className="ml-4">{renderInline(item)}</li>
    ));
    elements.push(
      listType === "ol"
        ? <ol key={`ol-${elements.length}`} className="list-decimal space-y-1 my-1 pl-2">{items}</ol>
        : <ul key={`ul-${elements.length}`} className="list-disc space-y-1 my-1 pl-2">{items}</ul>
    );
    listBuffer = [];
    listType = null;
  }

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    // Heading 1/2
    if (/^## /.test(line)) {
      flushList();
      elements.push(<h4 key={i} className="font-semibold text-ink mt-3 mb-1">{renderInline(line.slice(3))}</h4>);
      return;
    }
    if (/^# /.test(line)) {
      flushList();
      elements.push(<h3 key={i} className="font-bold text-ink mt-3 mb-1 text-base">{renderInline(line.slice(2))}</h3>);
      return;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      if (listType === "ol") flushList();
      listType = "ul";
      listBuffer.push(line.slice(2));
      return;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (listType === "ul") flushList();
      listType = "ol";
      listBuffer.push(line.replace(/^\d+\. /, ""));
      return;
    }

    flushList();

    // Blank line = paragraph break
    if (line === "") {
      elements.push(<br key={i} />);
      return;
    }

    elements.push(<p key={i} className="leading-relaxed">{renderInline(line)}</p>);
  });

  flushList();

  return <div className={cn("text-sm space-y-0.5", className)}>{elements}</div>;
}

/** Render inline markdown: bold, italic, inline code */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Split on **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else {
      parts.push(
        <code key={match.index} className="bg-stone/10 rounded px-1 py-0.5 text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}
