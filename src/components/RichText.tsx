import { FadeIn, SectionHeading } from "./ui";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { RichTextSectionData } from "../store/siteStore";

export function RichText({ dynamicData }: { dynamicData?: RichTextSectionData }) {
  const d: RichTextSectionData = {
    eyebrow: dynamicData?.eyebrow ?? "Official Documentation",
    title: dynamicData?.title || "Article Document",
    titleAccent: dynamicData?.titleAccent || "Overview",
    subtitle: dynamicData?.subtitle || "Read official details and guidelines.",
    content: dynamicData?.content || "## Article Content\n\nContent goes here.",
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto w-full max-w-4xl px-6">
        <SectionHeading
          eyebrow={d.eyebrow}
          title={d.title}
          titleAccent={d.titleAccent}
          subtitle={d.subtitle}
        />

        {d.content && (
          <FadeIn delay={0.08}>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10 backdrop-blur-xl shadow-xl text-white/80 leading-relaxed">
              <MarkdownRenderer content={d.content} />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
