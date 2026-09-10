import { FadeIn, SectionHeading } from "./ui";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { RichTextSectionData } from "../store/siteStore";

export function RichText({ dynamicData }: { dynamicData?: RichTextSectionData }) {
  const d: RichTextSectionData = dynamicData || {
    eyebrow: "Official Documentation",
    title: "About Us",
    titleAccent: "Details",
    subtitle: "Learn more about our platform, mission, and compliance.",
    content: "Content goes here.",
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
