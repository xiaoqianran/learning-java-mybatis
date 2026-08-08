import { createFileRoute, Link } from "@tanstack/react-router";
import { isCertificateReady, useProgress } from "@/store/progress";
import { getCourseLessons } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { Award, Lock } from "lucide-react";

export const Route = createFileRoute("/certificate")({
  component: CertificatePage,
});

function CertificatePage() {
  const mastered = useProgress((s) => s.mastered);
  const completed = useProgress((s) => s.completed);
  const ready = isCertificateReady(mastered, completed);
  const core = getCourseLessons();
  const mast = core.filter((l) => mastered.includes(l.slug)).length;

  return (
    <div className="mx-auto max-w-xl pb-16">
      <header className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">结业</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">结业证明</h1>
        <p className="mt-2 text-sm text-muted">
          主修课测验 ≥80%（mastered）后解锁。当前 {mast}/{core.length}
        </p>
      </header>

      {ready ? (
        <div className="rounded-2xl border border-primary/30 bg-surface p-8 text-center shadow-soft">
          <Award className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-xl font-semibold text-fg">
            Java + MyBatis 主修结业
          </h2>
          <p className="mt-2 text-sm text-muted">
            兹证明持有人已掌握本站主修路径（测验 ≥80%），并完成 Mapper / 动态 SQL / 工坊实践。
          </p>
          <p className="mt-6 font-mono text-xs text-subtle">
            learning-java-mybatis · {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-4 text-sm text-muted">
            继续完成主修课测验（≥80% 计入掌握）。可在学习中心查看缺口。
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/hub" className="no-underline">
              <Button variant="secondary">学习中心</Button>
            </Link>
            <Link to="/" className="no-underline">
              <Button>回首页</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
