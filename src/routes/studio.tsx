import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Circle, Database, Trash2 } from "lucide-react";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

type User = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  age: number;
  status: number;
};

type Article = {
  id: number;
  userId: number;
  title: string;
  content: string;
  status: string;
};

type Quest = {
  id: string;
  title: string;
  hint: string;
  done: boolean;
};

const SEED_USERS: User[] = [
  { id: 1, username: "alice", nickname: "爱丽丝", email: "alice@example.com", age: 22, status: 1 },
  { id: 2, username: "bob", nickname: "鲍勃", email: "bob@example.com", age: 28, status: 1 },
];

const SEED_ARTICLES: Article[] = [
  { id: 1, userId: 1, title: "MyBatis 入门", content: "注解 + XML", status: "PUBLISHED" },
  { id: 2, userId: 1, title: "动态 SQL", content: "if where foreach", status: "DRAFT" },
];

function StudioPage() {
  const [users, setUsers] = useState<User[]>(() => structuredClone(SEED_USERS));
  const [articles, setArticles] = useState<Article[]>(() => structuredClone(SEED_ARTICLES));
  const [log, setLog] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [newUser, setNewUser] = useState({ username: "", nickname: "", email: "" });
  const [quests, setQuests] = useState<Record<string, boolean>>({
    list: false,
    search: false,
    create: false,
    update: false,
    remove: false,
    article: false,
  });

  function pushLog(sql: string) {
    setLog((l) => [`==> ${sql}`, ...l].slice(0, 12));
  }

  function mark(id: keyof typeof quests) {
    setQuests((q) => ({ ...q, [id]: true }));
  }

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(k) ||
        u.nickname.toLowerCase().includes(k) ||
        u.email.toLowerCase().includes(k),
    );
  }, [users, keyword]);

  const questList: Quest[] = [
    { id: "list", title: "查询用户列表", hint: "Mapper.findAll → SELECT * FROM users", done: quests.list },
    { id: "search", title: "动态搜索", hint: "XML <if> + keyword", done: quests.search },
    { id: "create", title: "插入用户", hint: "insert + useGeneratedKeys", done: quests.create },
    { id: "update", title: "更新用户", hint: "UPDATE ... WHERE id=?", done: quests.update },
    { id: "remove", title: "删除用户", hint: "DELETE FROM users WHERE id=?", done: quests.remove },
    { id: "article", title: "按用户查文章", hint: "SELECT * FROM article WHERE user_id=?", done: quests.article },
  ];
  const doneCount = questList.filter((q) => q.done).length;

  useEffect(() => {
    // auto mark search when keyword used and list loaded
  }, []);

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">练 · 工坊</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">MyBatis REST 工坊</h1>
        <p className="mt-2 text-sm text-muted">
          浏览器内模拟 Mapper 调用与 SQL 日志。完成 6 个闯关任务（{doneCount}/6）。
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${Math.round((doneCount / questList.length) * 100)}%` }}
          />
        </div>
      </header>

      <section className="mb-6 grid gap-2 sm:grid-cols-2">
        {questList.map((q) => (
          <div
            key={q.id}
            className={cn(
              "flex gap-3 rounded-lg border px-3 py-2.5",
              q.done ? "border-primary/30 bg-primary-soft/40" : "border-border bg-surface",
            )}
          >
            {q.done ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
            )}
            <div>
              <p className="text-sm font-medium text-fg">{q.title}</p>
              <p className="text-xs text-muted">{q.hint}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-sm font-semibold">UserMapper</h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  pushLog("SELECT * FROM users");
                  mark("list");
                }}
              >
                findAll()
              </Button>
            </div>
            <div className="mb-3 flex gap-2">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="keyword"
                className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  pushLog(
                    keyword.trim()
                      ? `SELECT * FROM users WHERE username LIKE '%${keyword}%' /* dynamic <if> */`
                      : "SELECT * FROM users /* no keyword branch */",
                  );
                  mark("search");
                  mark("list");
                }}
              >
                search
              </Button>
            </div>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {filtered.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-fg">
                      #{u.id} {u.username}{" "}
                      <span className="text-muted">· {u.nickname}</span>
                    </p>
                    <p className="truncate font-mono text-[11px] text-subtle">{u.email}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setUsers((list) =>
                          list.map((x) =>
                            x.id === u.id ? { ...x, nickname: x.nickname + "✓" } : x,
                          ),
                        );
                        pushLog(`UPDATE users SET nickname=? WHERE id=${u.id}`);
                        mark("update");
                      }}
                    >
                      改
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setUsers((list) => list.filter((x) => x.id !== u.id));
                        pushLog(`DELETE FROM users WHERE id=${u.id}`);
                        mark("remove");
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <input
                placeholder="username"
                value={newUser.username}
                onChange={(e) => setNewUser((n) => ({ ...n, username: e.target.value }))}
                className="rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-xs"
              />
              <input
                placeholder="nickname"
                value={newUser.nickname}
                onChange={(e) => setNewUser((n) => ({ ...n, nickname: e.target.value }))}
                className="rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-xs"
              />
              <input
                placeholder="email"
                value={newUser.email}
                onChange={(e) => setNewUser((n) => ({ ...n, email: e.target.value }))}
                className="rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-xs"
              />
            </div>
            <Button
              className="mt-2"
              size="sm"
              onClick={() => {
                if (!newUser.username.trim()) return;
                const id = Math.max(0, ...users.map((u) => u.id)) + 1;
                setUsers((list) => [
                  ...list,
                  {
                    id,
                    username: newUser.username,
                    nickname: newUser.nickname || newUser.username,
                    email: newUser.email || `${newUser.username}@example.com`,
                    age: 20,
                    status: 1,
                  },
                ]);
                pushLog(
                  `INSERT INTO users(...) VALUES(...); /* useGeneratedKeys id=${id} */`,
                );
                setNewUser({ username: "", nickname: "", email: "" });
                mark("create");
              }}
            >
              insert + 回填 id
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold">ArticleMapper</h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  pushLog("SELECT * FROM article WHERE user_id = 1");
                  mark("article");
                }}
              >
                findByUserId(1)
              </Button>
            </div>
            <ul className="space-y-2">
              {articles
                .filter((a) => a.userId === 1)
                .map((a) => (
                  <li key={a.id} className="rounded-md border border-border bg-bg px-3 py-2 text-sm">
                    <span className="font-medium">{a.title}</span>
                    <span className="ml-2 font-mono text-[11px] text-subtle">{a.status}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-4 rounded-xl border border-border bg-code-bg">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted">
              <Database className="h-3.5 w-3.5 text-primary" />
              SQL 日志（模拟 StdOutImpl）
            </div>
            <pre className="max-h-[420px] overflow-auto p-3 font-mono text-[11px] leading-relaxed text-code-fg">
              {log.length ? log.join("\n") : "-- 点击上方操作产生 SQL"}
            </pre>
            <div className="border-t border-border p-2">
              <Button size="sm" variant="ghost" onClick={() => setLog([])}>
                清空日志
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setUsers(structuredClone(SEED_USERS));
                  setArticles(structuredClone(SEED_ARTICLES));
                  setQuests({
                    list: false,
                    search: false,
                    create: false,
                    update: false,
                    remove: false,
                    article: false,
                  });
                  setLog([]);
                }}
              >
                重置工坊
              </Button>
            </div>
          </div>
        </div>
      </div>

      {doneCount === questList.length ? (
        <p className="mt-6 rounded-lg border border-primary/30 bg-primary-soft px-4 py-3 text-sm text-fg">
          闯关完成。下一步：把同一套 CRUD 落到真实 Spring Boot + MyBatis 项目，并补动态 SQL 与事务。
        </p>
      ) : null}
    </div>
  );
}
