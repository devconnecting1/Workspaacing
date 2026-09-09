"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

const SECTIONS = [
  "what-is-workspaacing",
  "key-features",
  "tech-stack",
  "dashboards",
  "pages",
  "getting-started",
  "customization",
  "faq",
] as const;

const TOC_KEYS = [
  "sectionWhatIs",
  "sectionFeatures",
  "sectionTechStack",
  "sectionDashboards",
  "sectionPages",
  "sectionGettingStarted",
  "sectionCustomization",
  "sectionFaq",
] as const;

export function DocsToc() {
  const t = useTranslations("docs");
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => {
      for (const heading of headings) {
        observer.unobserve(heading);
      }
    };
  }, []);

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-28">
        <h4 className="mb-3 font-medium text-sm">{t("tocTitle")}</h4>
        <nav className="flex flex-col border-l pl-3">
          {SECTIONS.map((id, index) => (
            <a
              key={id}
              href={`#${id}`}
              className={`block py-1 text-sm transition-colors ${
                activeId === id ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(TOC_KEYS[index])}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
