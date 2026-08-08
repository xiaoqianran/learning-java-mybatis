import { useMemo, useState } from "react";
import type { DemoKind } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">交互 Demo</p>
        <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
        {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      </div>
      <div className="p-4">
        <DemoBody kind={kind} />
      </div>
    </section>
  );
}

function DemoBody({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "hash-vs-dollar":
      return <HashVsDollar />;
    case "result-map":
      return <ResultMapDemo />;
    case "crud-flow":
      return <CrudFlow />;
    case "dynamic-if":
      return <DynamicIf />;
    case "foreach-in":
      return <ForeachIn />;
    case "layer-arch":
      return <LayerArch />;
    case "transaction":
      return <TxDemo />;
    case "page-query":
      return <PageDemo />;
    case "one-to-many":
      return <AssocDemo />;
    case "sql-log":
      return <SqlLogDemo />;
    default:
      return <p className="text-sm text-muted">Demo 加载中…</p>;
  }
}

function HashVsDollar() {
  const [name, setName] = useState("alice");
  const hashSql = `SELECT * FROM users WHERE name = ?  -- param: '${name.replace(/'/g, "''")}'`;
  const dollarSql = `SELECT * FROM users WHERE name = '${name}'`;
  const injected = name.includes("'") || name.toLowerCase().includes(" or ");
  return (
    <div className="space-y-3">
      <label className="block text-xs text-muted">
        模拟用户输入 name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-fg"
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <SqlCard title="#{} 预编译" sql={hashSql} ok />
        <SqlCard title="${} 拼接" sql={dollarSql} ok={!injected} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setName("alice")}>
          正常
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setName("x' OR '1'='1")}
        >
          注入样例
        </Button>
      </div>
    </div>
  );
}

function SqlCard({ title, sql, ok }: { title: string; sql: string; ok: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        ok ? "border-border bg-bg" : "border-danger/40 bg-danger/10",
      )}
    >
      <p className="text-xs font-medium text-muted">{title}</p>
      <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] text-fg">{sql}</pre>
      <p className={cn("mt-2 text-[11px]", ok ? "text-success" : "text-danger")}>
        {ok ? "参数与 SQL 分离 / 安全" : "SQL 被改写 · 注入风险"}
      </p>
    </div>
  );
}

function ResultMapDemo() {
  const row = { id: 1, user_name: "alice", created_at: "2026-08-01 10:00:00" };
  const mapped = { id: 1, userName: "alice", createdAt: "2026-08-01 10:00:00" };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-border bg-bg p-3">
        <p className="text-xs text-muted">ResultSet 列</p>
        <pre className="mt-2 font-mono text-xs text-fg">{JSON.stringify(row, null, 2)}</pre>
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary-soft p-3">
        <p className="text-xs text-primary">Java 对象（驼峰）</p>
        <pre className="mt-2 font-mono text-xs text-fg">{JSON.stringify(mapped, null, 2)}</pre>
      </div>
    </div>
  );
}

function CrudFlow() {
  const [rows, setRows] = useState([
    { id: 1, username: "alice", status: 1 },
    { id: 2, username: "bob", status: 1 },
  ]);
  const [log, setLog] = useState<string[]>([]);
  function push(msg: string) {
    setLog((l) => [msg, ...l].slice(0, 6));
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
            setRows((r) => [...r, { id, username: `user${id}`, status: 1 }]);
            push(`insert → useGeneratedKeys id=${id}`);
          }}
        >
          insert
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRows((r) =>
              r.map((x) => (x.id === 1 ? { ...x, username: "alice_new" } : x)),
            );
            push("update users set username=? where id=1");
          }}
        >
          update #1
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRows((r) => r.filter((x) => x.id !== 2));
            push("delete from users where id=2");
          }}
        >
          delete #2
        </Button>
        <Button size="sm" variant="ghost" onClick={() => push("select * from users")}>
          select
        </Button>
      </div>
      <pre className="rounded-lg border border-border bg-bg p-3 font-mono text-xs">
        {JSON.stringify(rows, null, 2)}
      </pre>
      <ul className="space-y-1 text-xs text-muted">
        {log.map((l, i) => (
          <li key={i} className="font-mono">
            · {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DynamicIf() {
  const [keyword, setKeyword] = useState("al");
  const [status, setStatus] = useState<number | "">("");
  const sql = useMemo(() => {
    const parts: string[] = ["SELECT * FROM users"];
    const wh: string[] = [];
    if (keyword.trim()) wh.push(`(username LIKE '%${keyword}%' OR nickname LIKE '%${keyword}%')`);
    if (status !== "") wh.push(`status = ${status}`);
    if (wh.length) parts.push("WHERE " + wh.join(" AND "));
    parts.push("ORDER BY id DESC");
    return parts.join("\n");
  }, [keyword, status]);
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-muted">
          keyword
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="text-xs text-muted">
          status
          <select
            value={status === "" ? "" : String(status)}
            onChange={(e) => setStatus(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
          >
            <option value="">（不限）</option>
            <option value="1">1 active</option>
            <option value="0">0 disabled</option>
          </select>
        </label>
      </div>
      <pre className="rounded-lg border border-border bg-code-bg p-3 font-mono text-xs text-code-fg whitespace-pre-wrap">
        {sql}
      </pre>
    </div>
  );
}

function ForeachIn() {
  const [ids, setIds] = useState("1,2,3");
  const list = ids
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const sql =
    list.length === 0
      ? "-- 空列表：IN () 会语法错误，调用前请校验"
      : `SELECT * FROM users WHERE id IN (${list.map(() => "?").join(", ")})\n-- params: [${list.join(", ")}]`;
  return (
    <div className="space-y-3">
      <label className="text-xs text-muted">
        ids（逗号分隔）
        <input
          value={ids}
          onChange={(e) => setIds(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm"
        />
      </label>
      <pre className="rounded-lg border border-border bg-code-bg p-3 font-mono text-xs whitespace-pre-wrap">
        {sql}
      </pre>
    </div>
  );
}

function LayerArch() {
  const steps = [
    "HTTP GET /api/users",
    "UserController.list()",
    "UserService.listAll()",
    "UserMapper.findAll()",
    "SQL: SELECT * FROM users",
    "ResultMap → List<User> JSON",
  ];
  const [i, setI] = useState(0);
  return (
    <div className="space-y-3">
      <ol className="space-y-1">
        {steps.map((s, idx) => (
          <li
            key={s}
            className={cn(
              "rounded-md border px-3 py-2 font-mono text-xs",
              idx <= i
                ? "border-primary/40 bg-primary-soft text-fg"
                : "border-border bg-bg text-muted",
            )}
          >
            {idx + 1}. {s}
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setI(0)}>
          重置
        </Button>
        <Button size="sm" onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))}>
          下一步
        </Button>
      </div>
    </div>
  );
}

function TxDemo() {
  const [balance, setBalance] = useState({ a: 100, b: 50 });
  const [msg, setMsg] = useState("就绪");
  return (
    <div className="space-y-3">
      <p className="font-mono text-sm">
        A={balance.a} · B={balance.b}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            setBalance({ a: 80, b: 70 });
            setMsg("转账 20 成功 · 事务提交");
          }}
        >
          成功转账
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setMsg("扣款后抛错 → 整单回滚，余额不变");
            setBalance({ a: 100, b: 50 });
          }}
        >
          失败回滚
        </Button>
      </div>
      <p className="text-xs text-muted">{msg}</p>
    </div>
  );
}

function PageDemo() {
  const [page, setPage] = useState(1);
  const size = 5;
  const offset = (page - 1) * size;
  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-muted">
        page={page} size={size} → offset={offset}
      </p>
      <pre className="rounded-lg border border-border bg-code-bg p-3 font-mono text-xs">
        {`SELECT * FROM users ORDER BY id DESC\nLIMIT ${offset}, ${size}`}
      </pre>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          上一页
        </Button>
        <Button size="sm" onClick={() => setPage((p) => p + 1)}>
          下一页
        </Button>
      </div>
    </div>
  );
}

function AssocDemo() {
  const data = {
    id: 1,
    username: "alice",
    articles: [
      { id: 10, title: "MyBatis 入门" },
      { id: 11, title: "动态 SQL" },
    ],
  };
  return (
    <pre className="rounded-lg border border-border bg-bg p-3 font-mono text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function SqlLogDemo() {
  const lines = [
    "==>  Preparing: SELECT * FROM users WHERE id = ?",
    "==> Parameters: 1(Long)",
    "<==    Columns: id, username, nickname, status",
    "<==        Row: 1, alice, 爱丽丝, 1",
    "<==      Total: 1",
  ];
  return (
    <pre className="rounded-lg border border-border bg-code-bg p-3 font-mono text-[12px] leading-relaxed text-code-fg">
      {lines.join("\n")}
    </pre>
  );
}
