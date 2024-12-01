import { Dict } from "@/dict";
import { extractHeadings, Heading } from "@/utils/blog/headings";
import { promises as fs } from "fs";
import Link from "next/link";

type Props = { name: string; lang: Lang; dict: Dict["blog"]["toc"] };

export default async function ToC({ name, lang, dict }: Props) {
  const file = await fs.readFile(
    process.cwd() + `/src/dict/blog/${name}/${lang}.mdx`,
    "utf8"
  );
  const headings = extractHeadings(file);
  return (
    <aside className="top-20 sr-only lg:not-sr-only lg:sticky">
      <div className="w-80 max-w-80 lg:pl-6 lg:h-max">
        <h2 className="mb-2 text-sm text-font/75">{dict.title}</h2>
        <nav>
          <ol className="list-decimal">
            {headings.map((heading, index, arr) => {
              const subheadings: Heading[] = [];
              const targetLevel = 2;

              if (heading.level !== targetLevel) return;

              for (let i = index + 1; i < arr.length; i++) {
                // Stop when another level-2 heading is encountered
                if (arr[i].level <= targetLevel) {
                  break;
                }
                subheadings.push(arr[i]);
              }

              return (
                <Sublist {...heading} headings={subheadings} key={heading.id} />
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}

const Sublist = ({ id, text, headings }: Heading & { headings: Heading[] }) => (
  <li className="py-1 ml-5">
    <Link className="text-sm underline" href={`#${id}`}>
      {text}
    </Link>
    {headings.length > 0 && (
      <ul className="list-disc">
        {headings.map((heading) => (
          <LinkRef {...heading} key={heading.id} />
        ))}
      </ul>
    )}
  </li>
);

const LinkRef = ({ id, level, text }: Heading) => (
  <li className="py-1" style={{ marginLeft: `${(level - 2) * 16}px` }}>
    <Link className="text-sm underline" href={`#${id}`}>
      {text}
    </Link>
  </li>
);
