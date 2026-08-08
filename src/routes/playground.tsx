import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

const PRESETS = [
  {
    id: "search",
    label: "动态 search",
    xml: `<select id="search" resultType="User">
  SELECT * FROM users
  <where>
    <if test="keyword != null and keyword != ''">
      AND username LIKE CONCAT('%', #{keyword}, '%')
    </if>
    <if test="status != null">
      AND status = #{status}
    </if>
  </where>
  ORDER BY id DESC
</select>`,
  },
  {
    id: "foreach",
    label: "foreach IN",
    xml: `<select id="findByIds" resultType="User">
  SELECT * FROM users WHERE id IN
  <foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>`,
  },
  {
    id: "update",
    label: "updateSelective",
    xml: `<update id="updateSelective">
  UPDATE users
  <set>
    <if test="nickname != null">nickname = #{nickname},</if>
    <if test="email != null">email = #{email},</if>
    <if test="status != null">status = #{status},</if>
  </set>
  WHERE id = #{id}
</update>`,
  },
];

function PlaygroundPage() {
  const [presetId, setPresetId] = useState(PRESETS[0]!.id);
  const [xml, setXml] = useState(PRESETS[0]!.xml);
  const [keyword, setKeyword] = useState("alice");
  const [status, setStatus] = useState("1");
  const [ids, setIds] = useState("1,2,3");

  const rendered = useMemo(() => {
    // educational approximate expansion — not a full MyBatis engine
    if (presetId === "search") {
      const wh: string[] = [];
      if (keyword.trim()) wh.push(`username LIKE '%${keyword}%'`);
      if (status !== "") wh.push(`status = ${status}`);
      return (
        "SELECT * FROM users" +
        (wh.length ? "\nWHERE " + wh.join("\n  AND ") : "") +
        "\nORDER BY id DESC"
      );
    }
    if (presetId === "foreach") {
      const list = ids.split(/[,\s]+/).filter(Boolean);
      if (!list.length) return "-- empty IN list (invalid SQL)";
      return `SELECT * FROM users WHERE id IN (${list.map(() => "?").join(", ")})\n-- params: ${list.join(", ")}`;
    }
    // update
    const sets: string[] = [];
    sets.push("nickname = ?");
    sets.push("email = ?");
    if (status !== "") sets.push(`status = ${status}`);
    return `UPDATE users\nSET ${sets.join(", ")}\nWHERE id = ?`;
  }, [presetId, keyword, status, ids]);

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">练 · Mapper 沙箱</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">动态 SQL 演练</h1>
        <p className="mt-2 text-sm text-muted">
          左侧是 Mapper XML，右侧是「条件展开后」的近似 SQL（教学模拟，非完整 MyBatis 引擎）。
        </p>
      </header>

      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPresetId(p.id);
              setXml(p.xml);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              presetId === p.id
                ? "border-primary/40 bg-primary-soft text-primary"
                : "border-border bg-surface text-muted hover:text-fg",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-code-bg">
          <div className="border-b border-border px-3 py-2 text-xs text-muted">Mapper XML</div>
          <textarea
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            className="min-h-[280px] w-full resize-y bg-transparent p-3 font-mono text-[12px] leading-relaxed text-code-fg outline-none"
            spellCheck={false}
          />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="mb-2 text-xs font-medium text-muted">绑定参数</p>
            {presetId !== "foreach" ? (
              <div className="grid gap-2">
                <label className="text-xs text-muted">
                  keyword
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-sm"
                  />
                </label>
                <label className="text-xs text-muted">
                  status
                  <input
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-sm"
                  />
                </label>
              </div>
            ) : (
              <label className="text-xs text-muted">
                ids
                <input
                  value={ids}
                  onChange={(e) => setIds(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-sm"
                />
              </label>
            )}
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary-soft/30">
            <div className="border-b border-border px-3 py-2 text-xs text-primary">展开 SQL（模拟）</div>
            <pre className="whitespace-pre-wrap p-3 font-mono text-[12px] text-fg">{rendered}</pre>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const p = PRESETS.find((x) => x.id === presetId);
              if (p) setXml(p.xml);
            }}
          >
            重置 XML
          </Button>
        </div>
      </div>
    </div>
  );
}
