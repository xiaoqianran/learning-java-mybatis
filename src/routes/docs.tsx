import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS } from "@/data/lessons";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const OFFICIAL = [
  {
    title: "Getting started",
    url: "https://mybatis.org/mybatis-3/zh/getting-started.html",
    slugs: ["intro", "config"],
  },
  {
    title: "Mapper XML / 动态 SQL",
    url: "https://mybatis.org/mybatis-3/zh/dynamic-sql.html",
    slugs: ["dynamic-if", "choose-set", "foreach", "hash-dollar"],
  },
  {
    title: "SQL 映射语句",
    url: "https://mybatis.org/mybatis-3/zh/sqlmap-xml.html",
    slugs: ["annotation-crud", "result-map", "params", "association", "collection"],
  },
  {
    title: "配置",
    url: "https://mybatis.org/mybatis-3/zh/configuration.html",
    slugs: ["config", "cache", "type-handler", "plugin"],
  },
  {
    title: "Spring Boot Starter",
    url: "https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/",
    slugs: ["spring-boot", "transaction"],
  },
];

function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">查 · 文档地图</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">官方文档 ↔ 本站课</h1>
        <p className="mt-2 text-sm text-muted">
          对照{" "}
          <a
            href="https://mybatis.org/mybatis-3/zh/index.html"
            className="text-primary no-underline hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            MyBatis 中文文档
          </a>
          ，按主题跳进对应课程。
        </p>
      </header>
      <div className="space-y-4">
        {OFFICIAL.map((block) => (
          <section key={block.title} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-display text-base font-semibold">{block.title}</h2>
              <a
                href={block.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary no-underline hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                官方
              </a>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {block.slugs.map((slug) => {
                const l = LESSONS.find((x) => x.slug === slug);
                if (!l) return null;
                return (
                  <li key={slug}>
                    <Link
                      to="/lesson/$slug"
                      params={{ slug }}
                      className="inline-flex rounded-full border border-border bg-bg px-2.5 py-1 text-xs text-fg no-underline hover:border-primary/40"
                    >
                      {l.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
