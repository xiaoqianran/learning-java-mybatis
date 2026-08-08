import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "参数与安全",
    items: [
      { k: "#{}", v: "预编译占位，值参数默认用它" },
      { k: "${}", v: "字符串拼接；仅白名单表名/列名" },
      { k: "@Param", v: "多参数命名，XML 用 #{name}" },
    ],
  },
  {
    title: "注解",
    items: [
      { k: "@Select / Insert / Update / Delete", v: "简单 CRUD" },
      { k: "@Options(useGeneratedKeys)", v: "回填主键 keyProperty" },
      { k: "@Results / @Result", v: "注解版结果映射" },
      { k: "@Mapper", v: "声明 Mapper 接口" },
    ],
  },
  {
    title: "动态 SQL",
    items: [
      { k: "<if test>", v: "条件片段" },
      { k: "<where>", v: "去掉首个多余 AND/OR" },
      { k: "<set>", v: "动态 UPDATE 去尾逗号" },
      { k: "<choose>/<when>", v: "多分支" },
      { k: "<foreach>", v: "IN / 批量插入" },
      { k: "<trim>", v: "自定义前后缀裁剪" },
    ],
  },
  {
    title: "映射",
    items: [
      { k: "resultType", v: "简单映射 / 驼峰自动" },
      { k: "resultMap", v: "复杂映射入口" },
      { k: "association", v: "多对一" },
      { k: "collection", v: "一对多" },
    ],
  },
  {
    title: "Spring",
    items: [
      { k: "mybatis-spring-boot-starter", v: "自动配置" },
      { k: "@MapperScan", v: "包扫描" },
      { k: "@Transactional", v: "放 Service 边界" },
      { k: "map-underscore-to-camel-case", v: "user_name → userName" },
    ],
  },
  {
    title: "工程",
    items: [
      { k: "StdOutImpl", v: "开发看 SQL；生产关闭" },
      { k: "PageHelper / LIMIT", v: "分页" },
      { k: "Interceptor", v: "插件扩展点" },
      { k: "TypeHandler", v: "类型转换" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">查</p>
        <h1 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
          MyBatis 速查表
        </h1>
        <p className="mt-2 text-sm text-muted">
          写 Mapper 时扫一眼。更完整的说明见各节课程与{" "}
          <a
            href="https://mybatis.org/mybatis-3/zh/index.html"
            target="_blank"
            rel="noreferrer"
            className="text-primary no-underline hover:underline"
          >
            mybatis.org
          </a>
          。
        </p>
      </header>
      <div className="space-y-6">
        {SECTIONS.map((sec) => (
          <section
            key={sec.title}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 font-display text-sm font-semibold">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((it) => (
                <li
                  key={it.k}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4"
                >
                  <code className="font-mono text-[13px] text-primary">{it.k}</code>
                  <span className="text-sm text-muted">{it.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
