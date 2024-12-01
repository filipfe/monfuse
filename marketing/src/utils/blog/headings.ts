import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

export interface Heading {
  level: number; // e.g., 1 for h1, 2 for h2
  text: string; // The raw text of the heading
  id: string; // Slugified id of the heading
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];

  const processor = unified().use(remarkParse);

  const tree = processor.parse(markdown);

  visit(tree, "heading", (node: any) => {
    const level = node.depth; // Depth represents heading level
    if (level === 1) return;
    const text = node.children
      .filter((child: any) => child.type === "text")
      .map((child: any) => child.value)
      .join("");
    const id = slugifyHeading(text); // Use your slugify function
    headings.push({ level, text, id });
  });

  return headings;
}

export function slugifyHeading(text: string) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
