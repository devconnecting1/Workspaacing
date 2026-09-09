import { BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DocsToc } from "./_components/docs-toc";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("docs");
  return {
    title: `${t("breadcrumb")} - Workspaacing`,
    description: "Learn how to use Workspaacing, an AI-powered admin dashboard IDE.",
  };
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-16 mb-4 scroll-mt-24 font-semibold text-2xl tracking-tight">
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 mb-3 font-semibold text-lg tracking-tight">{children}</h3>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>;
}

function ListItem({ children }: { children: React.ReactNode }) {
  return <li className="mb-2 text-muted-foreground leading-relaxed">{children}</li>;
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

export default async function DocsPage() {
  const t = await getTranslations("docs");

  return (
    <div className="mx-auto max-w-4xl px-6 pt-10 pb-20 md:px-8 md:pt-16 md:pb-24">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-muted-foreground text-sm">
        <BookOpen aria-hidden="true" className="size-4" />
        <span>{t("breadcrumb")}</span>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span className="text-foreground">Workspaacing</span>
      </nav>

      <div className="flex gap-12">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          {/* Header */}
          <h1 className="mb-2 font-bold text-4xl tracking-tight">{t("title")}</h1>
          <p className="mb-8 text-muted-foreground text-sm">{t("lastUpdated")}</p>
          <Paragraph>{t("intro1")}</Paragraph>
          <Paragraph>{t("intro2")}</Paragraph>

          {/* What is Workspaacing */}
          <SectionHeading id="what-is-workspaacing">{t("sectionWhatIs")}</SectionHeading>
          <Paragraph>{t("whatIsDesc1")}</Paragraph>
          <Paragraph>{t("whatIsIncludes")}</Paragraph>
          <ul className="mb-6 ml-6 list-disc space-y-2">
            <ListItem>
              <Bold>{t("featureDashboards")}</Bold> — {t("featureDashboardsDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("featureAuth")}</Bold> — {t("featureAuthDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("featureThemes")}</Bold> — {t("featureThemesDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("featureLayout")}</Bold> — {t("featureLayoutDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("featureI18n")}</Bold> — {t("featureI18nDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("featurePages")}</Bold> — {t("featurePagesDesc")}
            </ListItem>
          </ul>

          {/* Key features */}
          <SectionHeading id="key-features">{t("sectionFeatures")}</SectionHeading>
          <Paragraph>{t("featuresDesc")}</Paragraph>
          <ul className="mb-6 ml-6 list-disc space-y-2">
            <ListItem>
              <Bold>{t("benefitProductivity")}</Bold> — {t("benefitProductivityDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("benefitDesign")}</Bold> — {t("benefitDesignDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("benefitTheme")}</Bold> — {t("benefitThemeDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("benefitType")}</Bold> — {t("benefitTypeDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("benefitPerformance")}</Bold> — {t("benefitPerformanceDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("benefitCicd")}</Bold> — {t("benefitCicdDesc")}
            </ListItem>
            <ListItem>
              <Bold>{t("benefitSecurity")}</Bold> — {t("benefitSecurityDesc")}
            </ListItem>
          </ul>

          {/* Tech stack */}
          <SectionHeading id="tech-stack">{t("sectionTechStack")}</SectionHeading>
          <Paragraph>{t("techStackDesc")}</Paragraph>
          <div className="mb-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">{t("colTechnology")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("colPurpose")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Next.js 16</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techNextjs")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">React 19</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techReact")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">TypeScript 7</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techTypescript")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Tailwind CSS v4</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techTailwind")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">shadcn/ui</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techShadcn")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Radix UI</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techRadix")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">next-intl</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techNextIntl")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">next-themes</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techNextThemes")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Recharts</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techRecharts")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Biome</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techBiome")}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Vercel</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("techVercel")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dashboards */}
          <SectionHeading id="dashboards">{t("sectionDashboards")}</SectionHeading>
          <Paragraph>{t("dashboardsDesc")}</Paragraph>
          <div className="mb-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">{t("colDashboard")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("colDescription")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Default</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashDefault")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">CRM</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashCrm")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Finance</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashFinance")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Analytics</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashAnalytics")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Productivity</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashProductivity")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">E-commerce</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashEcommerce")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Academy</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashAcademy")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Logistics</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashLogistics")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Infrastructure</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashInfrastructure")}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">File Manager</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashFileManager")}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Patient Monitoring</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("dashPatient")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pages */}
          <SectionHeading id="pages">{t("sectionPages")}</SectionHeading>
          <Paragraph>{t("pagesDesc")}</Paragraph>
          <ul className="mb-6 ml-6 list-disc space-y-2">
            <ListItem>
              <Bold>Authentication</Bold> — {t("pageAuth")}
            </ListItem>
            <ListItem>
              <Bold>Email</Bold> — {t("pageEmail")}
            </ListItem>
            <ListItem>
              <Bold>Chat</Bold> — {t("pageChat")}
            </ListItem>
            <ListItem>
              <Bold>Calendar</Bold> — {t("pageCalendar")}
            </ListItem>
            <ListItem>
              <Bold>Kanban</Bold> — {t("pageKanban")}
            </ListItem>
            <ListItem>
              <Bold>Tasks</Bold> — {t("pageTasks")}
            </ListItem>
            <ListItem>
              <Bold>Invoice</Bold> — {t("pageInvoice")}
            </ListItem>
            <ListItem>
              <Bold>Profile</Bold> — {t("pageProfile")}
            </ListItem>
            <ListItem>
              <Bold>Users &amp; Roles</Bold> — {t("pageUsers")}
            </ListItem>
          </ul>

          {/* Getting started */}
          <SectionHeading id="getting-started">{t("sectionGettingStarted")}</SectionHeading>
          <Paragraph>{t("gettingStartedDesc")}</Paragraph>
          <SubHeading>{t("subPrerequisites")}</SubHeading>
          <ul className="mb-6 ml-6 list-disc space-y-2">
            <ListItem>
              <Bold>Node.js 18+</Bold> — {t("prereqNode")}
            </ListItem>
            <ListItem>
              <Bold>npm ou pnpm</Bold> — {t("prereqNpm")}
            </ListItem>
            <ListItem>
              <Bold>Git</Bold> — {t("prereqGit")}
            </ListItem>
          </ul>
          <SubHeading>{t("subInstallation")}</SubHeading>
          <div className="mb-6 rounded-lg border bg-muted/30 p-4 font-mono text-sm">
            <div className="text-muted-foreground">{t("installClone")}</div>
            <div>git clone https://github.com/mineblox99los/project.git</div>
            <div className="mt-2 text-muted-foreground">{t("installDeps")}</div>
            <div>cd project_83675467</div>
            <div>npm install</div>
            <div className="mt-2 text-muted-foreground">{t("installRun")}</div>
            <div>npm run dev</div>
          </div>
          <Paragraph>
            {t("installOpen")}{" "}
            <a href="http://localhost:3000" className="text-primary underline underline-offset-4 hover:text-primary/80">
              http://localhost:3000
            </a>
          </Paragraph>
          <SubHeading>{t("subDemoCredentials")}</SubHeading>
          <div className="mb-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">{t("colField")}</th>
                  <th className="px-4 py-3 text-left font-medium">{t("colValue")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Email</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">any@email.com</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Password</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">any password (6+ chars)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customization */}
          <SectionHeading id="customization">{t("sectionCustomization")}</SectionHeading>
          <Paragraph>{t("customizationDesc")}</Paragraph>
          <SubHeading>{t("subThemes")}</SubHeading>
          <Paragraph>{t("themesDesc")}</Paragraph>
          <SubHeading>{t("subNavigation")}</SubHeading>
          <Paragraph>{t("navigationDesc")}</Paragraph>
          <SubHeading>{t("subLayout")}</SubHeading>
          <Paragraph>{t("layoutDesc")}</Paragraph>
          <SubHeading>{t("subI18n")}</SubHeading>
          <Paragraph>
            {t("i18nDesc1")} <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">messages/</code>{" "}
            {t("i18nDesc2")}
          </Paragraph>

          {/* FAQ */}
          <SectionHeading id="faq">{t("sectionFaq")}</SectionHeading>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-lg">{t("faqFree")}</h3>
              <Paragraph>{t("faqFreeAnswer")}</Paragraph>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg">{t("faqCommercial")}</h3>
              <Paragraph>{t("faqCommercialAnswer")}</Paragraph>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg">{t("faqBackend")}</h3>
              <Paragraph>{t("faqBackendAnswer")}</Paragraph>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg">{t("faqDeploy")}</h3>
              <Paragraph>{t("faqDeployAnswer")}</Paragraph>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg">{t("faqNewPages")}</h3>
              <Paragraph>{t("faqNewPagesAnswer")}</Paragraph>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg">{t("faqBrowsers")}</h3>
              <Paragraph>{t("faqBrowsersAnswer")}</Paragraph>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 border-t pt-8">
            <p className="text-muted-foreground text-sm">
              {t("footerQuestions")}{" "}
              <a
                href="https://github.com/mineblox99los/project/issues"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                {t("footerIssue")}
                <ExternalLink aria-hidden="true" className="ml-1 inline size-3" />
              </a>
            </p>
            <p className="mt-2 text-muted-foreground text-sm">{t("builtBy")}</p>
          </div>
        </article>

        {/* Table of contents sidebar */}
        <DocsToc />
      </div>
    </div>
  );
}
