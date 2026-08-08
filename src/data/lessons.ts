export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "hash-vs-dollar"
  | "result-map"
  | "crud-flow"
  | "dynamic-if"
  | "foreach-in"
  | "layer-arch"
  | "transaction"
  | "page-query"
  | "one-to-many"
  | "sql-log";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "Spring 整合" | "动态 SQL" | "关联与分页" | "工程化" | "面试串讲";
  format?: "course" | "reference";
  minutes: number;
  official?: string;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "MyBatis 是什么",
    summary: "半自动 ORM：SQL 可控、映射清晰。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "https://mybatis.org/mybatis-3/zh/getting-started.html",
    blocks: [
      {
        type: "text",
        title: "定位",
        body: "MyBatis 是持久层框架：你写 SQL，它负责把结果集映射成 Java 对象。\n\n对比：\n• JDBC：样板多、易漏关连接\n• 全自动 ORM（JPA）：隐藏 SQL，复杂报表难控\n• MyBatis：SQL 在你手里，映射交给框架\n\n学习路径：先会注解 CRUD → 再掌握 XML 动态 SQL → 最后 Spring Boot 分层工程。",
      },
      {
        type: "code",
        title: "最小 Mapper 接口",
        lang: "java",
        code: `@Mapper
public interface UserMapper {
  @Select("SELECT * FROM users WHERE id = #{id}")
  User findById(Long id);
}`,
      },
      {
        type: "tip",
        body: "本站用「讲解 → 源码 → 交互 Demo → 测验」组织，和 learning-vue3 同一套学习节奏。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "MyBatis 的核心特点？",
            options: ["完全隐藏 SQL", "SQL 可控 + 结果映射", "只支持 XML", "替代 Spring"],
            answer: 1,
            explain: "半自动：SQL 你写，映射它做。",
          },
          {
            id: "i2",
            question: "典型入口是？",
            options: ["Controller", "Mapper 接口 / XML", "Servlet", "JSP"],
            answer: 1,
            explain: "Mapper 是持久层契约。",
          },
        ],
      },
    ],
  },
  {
    slug: "config",
    title: "配置与 SqlSession",
    summary: "数据源、mappers、类型别名。",
    level: "入门",
    track: "基础",
    minutes: 10,
    official: "https://mybatis.org/mybatis-3/zh/configuration.html",
    blocks: [
      {
        type: "text",
        title: "两条配置线",
        body: "1) 原生：mybatis-config.xml + SqlSessionFactory\n2) Spring Boot：application.yml + mybatis-spring-boot-starter（推荐）\n\n核心对象：\n• SqlSessionFactory：重的、应用级\n• SqlSession：轻的、请求级，用完关闭\n• Mapper：接口代理，真正执行 SQL",
      },
      {
        type: "code",
        title: "application.yml 精简配置",
        lang: "yaml",
        code: `mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.demo.domain
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl`,
      },
      {
        type: "demo",
        kind: "sql-log",
        title: "动手：看日志里的 SQL",
        hint: "打开 StdOutImpl 后，每次查询都会打印最终 SQL 与参数。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "map-underscore-to-camel-case 的作用？",
            options: ["改表名", "user_name → userName", "开启二级缓存", "自动建表"],
            answer: 1,
            explain: "下划线列自动映射驼峰属性。",
          },
        ],
      },
    ],
  },
  {
    slug: "hash-dollar",
    title: "#{} 与 ${}",
    summary: "预编译 vs 字符串拼接，防注入。",
    level: "入门",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "必须分清",
        body: "#{id} → 预编译占位符 ?，安全，用于值。\n${column} → 直接拼进 SQL，用于动态表名/列名/ORDER BY，但绝不能拼用户输入原文。\n\n面试高频：为什么 #{} 能防 SQL 注入？因为参数走 PreparedStatement。",
      },
      {
        type: "code",
        title: "危险写法 vs 安全写法",
        lang: "xml",
        code: `<!-- 危险：用户输入直接拼接 -->
SELECT * FROM users WHERE name = '\${name}'

<!-- 安全：预编译 -->
SELECT * FROM users WHERE name = #{name}

<!-- 动态排序：白名单校验后再 \${col} -->
ORDER BY \${safeColumn} ASC`,
      },
      {
        type: "demo",
        kind: "hash-vs-dollar",
        title: "动手：对比 #{} / ${}",
        hint: "输入恶意字符串，观察两种写法最终 SQL 差异。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "h1",
            question: "用户输入的查询条件应该用？",
            options: ["${}", "#{}", "两者都行", "拼字符串"],
            answer: 1,
            explain: "值一律 #{}。",
          },
          {
            id: "h2",
            question: "${} 适合？",
            options: ["任意用户输入", "已校验的列名/表名", "密码", "邮箱"],
            answer: 1,
            explain: "仅限白名单动态标识符。",
          },
        ],
      },
    ],
  },
  {
    slug: "annotation-crud",
    title: "注解 CRUD",
    summary: "@Select/@Insert/@Update/@Delete 一把梭。",
    level: "入门",
    track: "基础",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "注解够用的场景",
        body: "简单 SQL、团队想「接口即文档」时，注解很香。复杂动态 SQL 再上 XML。\n\n插入取主键：@Options(useGeneratedKeys = true, keyProperty = \"id\")",
      },
      {
        type: "code",
        title: "UserMapper 注解版",
        lang: "java",
        code: `@Mapper
public interface UserMapper {
  @Select("SELECT * FROM users WHERE id = #{id}")
  User findById(Long id);

  @Select("SELECT * FROM users")
  List<User> findAll();

  @Insert("INSERT INTO users(username, nickname, email, age, status) " +
          "VALUES(#{username}, #{nickname}, #{email}, #{age}, #{status})")
  @Options(useGeneratedKeys = true, keyProperty = "id")
  int insert(User user);

  @Update("UPDATE users SET nickname=#{nickname}, email=#{email}, " +
          "age=#{age}, status=#{status} WHERE id=#{id}")
  int update(User user);

  @Delete("DELETE FROM users WHERE id = #{id}")
  int deleteById(Long id);
}`,
      },
      {
        type: "demo",
        kind: "crud-flow",
        title: "动手：走一遍 CRUD",
        hint: "模拟调用 Mapper，看入参与返回值。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "a1",
            question: "插入后回填主键靠？",
            options: ["@Param", "@Options useGeneratedKeys", "@Results", "手动 MAX(id)"],
            answer: 1,
            explain: "keyProperty 写实体字段名。",
          },
        ],
      },
    ],
  },
  {
    slug: "result-map",
    title: "ResultMap 映射",
    summary: "列与属性不对齐时的正解。",
    level: "入门",
    track: "基础",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "何时需要 ResultMap",
        body: "• 列名与属性名无法自动映射\n• 需要一对多/多对一嵌套\n• 需要 typeHandler 定制\n\n简单场景靠 map-underscore-to-camel-case + resultType 即可。",
      },
      {
        type: "code",
        title: "ResultMap 示例",
        lang: "xml",
        code: `<resultMap id="UserMap" type="User">
  <id property="id" column="id"/>
  <result property="username" column="username"/>
  <result property="createdAt" column="created_at"/>
</resultMap>

<select id="findById" resultMap="UserMap">
  SELECT * FROM users WHERE id = #{id}
</select>`,
      },
      {
        type: "demo",
        kind: "result-map",
        title: "动手：列 → 属性映射",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "rm1",
            question: "主键映射标签？",
            options: ["<result>", "<id>", "<collection>", "<param>"],
            answer: 1,
            explain: "主键用 id。",
          },
        ],
      },
    ],
  },
  {
    slug: "params",
    title: "多参数与 @Param",
    summary: "单对象 / Map / 多参命名。",
    level: "入门",
    track: "基础",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "规则",
        body: "• 单参数（非 Map/List）：可直接 #{id}\n• 多参数：用 @Param(\"name\") 命名，XML 里 #{name}\n• 实体对象：#{username} 取属性\n• 集合：常配合 foreach",
      },
      {
        type: "code",
        title: "多参数",
        lang: "java",
        code: `List<User> search(
  @Param("keyword") String keyword,
  @Param("status") Integer status
);`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "两个基本类型参数推荐？",
            options: ["靠 arg0/arg1", "@Param 命名", "只能塞进 Map", "只能写 XML"],
            answer: 1,
            explain: "可读性 + 重构安全。",
          },
        ],
      },
    ],
  },
  {
    slug: "spring-boot",
    title: "Spring Boot 整合",
    summary: "starter、扫描、分层。",
    level: "进阶",
    track: "Spring 整合",
    minutes: 12,
    official: "https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/",
    blocks: [
      {
        type: "text",
        title: "整合清单",
        body: "1. 依赖 mybatis-spring-boot-starter + 数据库驱动\n2. 配置 datasource + mybatis\n3. Mapper 加 @Mapper，或 @MapperScan\n4. Service 调 Mapper，Controller 调 Service\n5. 事务：@Transactional 放 Service",
      },
      {
        type: "code",
        title: "典型分层",
        lang: "java",
        code: `@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @GetMapping
  public List<User> list() {
    return userService.listAll();
  }
}

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserMapper userMapper;

  public List<User> listAll() {
    return userMapper.findAll();
  }
}`,
      },
      {
        type: "demo",
        kind: "layer-arch",
        title: "动手：请求如何落到 SQL",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sb1",
            question: "事务注解通常放在？",
            options: ["Controller", "Service", "Mapper 接口", "Entity"],
            answer: 1,
            explain: "业务边界上开启事务。",
          },
        ],
      },
    ],
  },
  {
    slug: "transaction",
    title: "事务与回滚",
    summary: "@Transactional 边界与失效场景。",
    level: "进阶",
    track: "Spring 整合",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "常见坑",
        body: "• 同类内部 this.xxx() 调用不走代理 → 事务失效\n• 异常被吞掉 / 非 RuntimeException 默认不回滚\n• 只读事务别写库\n• 长事务锁表，拆小",
      },
      {
        type: "code",
        title: "回滚示例",
        lang: "java",
        code: `@Transactional(rollbackFor = Exception.class)
public void transfer(Long from, Long to, int amount) {
  accountMapper.decrease(from, amount);
  if (amount < 0) throw new IllegalArgumentException("bad amount");
  accountMapper.increase(to, amount);
}`,
      },
      {
        type: "demo",
        kind: "transaction",
        title: "动手：失败是否回滚",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "tx1",
            question: "默认回滚哪些异常？",
            options: ["所有 Exception", "RuntimeException / Error", "仅 IOException", "仅自定义"],
            answer: 1,
            explain: "checked 异常需 rollbackFor。",
          },
        ],
      },
    ],
  },
  {
    slug: "dynamic-if",
    title: "动态 SQL：if / where",
    summary: "条件拼接不踩 AND 坑。",
    level: "进阶",
    track: "动态 SQL",
    minutes: 14,
    official: "https://mybatis.org/mybatis-3/zh/dynamic-sql.html",
    blocks: [
      {
        type: "text",
        title: "where 标签的价值",
        body: "<where> 会自动去掉首个多余 AND/OR，避免 WHERE 后直接 AND。\n\nOGNL：test=\"keyword != null and keyword != ''\"",
      },
      {
        type: "code",
        title: "search 动态条件",
        lang: "xml",
        code: `<select id="search" resultType="User">
  SELECT * FROM users
  <where>
    <if test="keyword != null and keyword != ''">
      AND (username LIKE CONCAT('%', #{keyword}, '%')
        OR nickname LIKE CONCAT('%', #{keyword}, '%'))
    </if>
    <if test="status != null">
      AND status = #{status}
    </if>
  </where>
  ORDER BY id DESC
</select>`,
      },
      {
        type: "demo",
        kind: "dynamic-if",
        title: "动手：勾选条件生成 SQL",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "d1",
            question: "<where> 主要解决？",
            options: ["分页", "多余 AND/OR", "缓存", "事务"],
            answer: 1,
            explain: "智能裁剪 where 子句。",
          },
        ],
      },
    ],
  },
  {
    slug: "choose-set",
    title: "choose / set",
    summary: "分支选择与动态 UPDATE。",
    level: "进阶",
    track: "动态 SQL",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "两个高频标签",
        body: "<choose>/<when>/<otherwise> ≈ switch\n<set> 用于 UPDATE，自动处理尾逗号\n\nupdateSelective：只更新非空字段，非常实用。",
      },
      {
        type: "code",
        title: "updateSelective",
        lang: "xml",
        code: `<update id="updateSelective">
  UPDATE users
  <set>
    <if test="nickname != null">nickname = #{nickname},</if>
    <if test="email != null">email = #{email},</if>
    <if test="age != null">age = #{age},</if>
    <if test="status != null">status = #{status},</if>
  </set>
  WHERE id = #{id}
</update>`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cs1",
            question: "动态 UPDATE 去尾逗号用？",
            options: ["<where>", "<set>", "<trim prefixOverrides>", "两个都行但 set 更直观"],
            answer: 3,
            explain: "set 内部就是 trim 封装。",
          },
        ],
      },
    ],
  },
  {
    slug: "foreach",
    title: "foreach 批量与 IN",
    summary: "ids 列表、批量插入。",
    level: "进阶",
    track: "动态 SQL",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "foreach 属性",
        body: "collection / item / open / separator / close\n\nIN 查询：open=\"(\" separator=\",\" close=\")\"\n批量插入：多次 VALUES 段",
      },
      {
        type: "code",
        title: "IN 与批量插入",
        lang: "xml",
        code: `<select id="findByIds" resultType="User">
  SELECT * FROM users WHERE id IN
  <foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>

<insert id="insertBatch">
  INSERT INTO users(username, nickname) VALUES
  <foreach collection="list" item="u" separator=",">
    (#{u.username}, #{u.nickname})
  </foreach>
</insert>`,
      },
      {
        type: "demo",
        kind: "foreach-in",
        title: "动手：生成 IN 子句",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: "空列表 foreach IN 可能？",
            options: ["永远正确", "生成 IN () 语法错误", "自动变全表", "忽略 where"],
            answer: 1,
            explain: "调用前校验非空，或换策略。",
          },
        ],
      },
    ],
  },
  {
    slug: "association",
    title: "多对一 association",
    summary: "文章带作者。",
    level: "实战",
    track: "关联与分页",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "association",
        body: "多对一：多篇文章 → 一个用户。\n\n可用：\n1) 联表 + resultMap association\n2) 嵌套 select（N+1 风险）\n\n生产优先联表或批量二次查询。",
      },
      {
        type: "code",
        title: "联表 association",
        lang: "xml",
        code: `<resultMap id="ArticleWithUser" type="Article">
  <id property="id" column="id"/>
  <result property="title" column="title"/>
  <association property="author" javaType="User">
    <id property="id" column="uid"/>
    <result property="username" column="username"/>
  </association>
</resultMap>

<select id="findWithAuthor" resultMap="ArticleWithUser">
  SELECT a.id, a.title, u.id AS uid, u.username
  FROM article a JOIN users u ON a.user_id = u.id
  WHERE a.id = #{id}
</select>`,
      },
      {
        type: "demo",
        kind: "one-to-many",
        title: "动手：关联结果树",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "as1",
            question: "多对一用哪个标签？",
            options: ["collection", "association", "discriminator", "foreach"],
            answer: 1,
            explain: "一对多才是 collection。",
          },
        ],
      },
    ],
  },
  {
    slug: "collection",
    title: "一对多 collection",
    summary: "用户带文章列表。",
    level: "实战",
    track: "关联与分页",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "collection",
        body: "一对多：一个用户 → 多篇文章。\n注意：联表一对多会「行膨胀」，主键要写对，否则对象合并错误。",
      },
      {
        type: "code",
        title: "User 含 articles",
        lang: "xml",
        code: `<resultMap id="UserWithArticles" type="User">
  <id property="id" column="id"/>
  <result property="username" column="username"/>
  <collection property="articles" ofType="Article">
    <id property="id" column="aid"/>
    <result property="title" column="title"/>
  </collection>
</resultMap>`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "col1",
            question: "一对多标签？",
            options: ["association", "collection", "id", "set"],
            answer: 1,
            explain: "collection 映射列表。",
          },
        ],
      },
    ],
  },
  {
    slug: "pagination",
    title: "分页查询",
    summary: "LIMIT / PageHelper / 手写 count。",
    level: "实战",
    track: "关联与分页",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "三种做法",
        body: "1) SQL LIMIT #{offset}, #{size}\n2) PageHelper 插件拦截\n3) MyBatis-Plus IPage\n\n深分页优化：避免大 offset，用「上次最大 id」游标分页。",
      },
      {
        type: "code",
        title: "手写分页",
        lang: "xml",
        code: `<select id="pageUsers" resultType="User">
  SELECT * FROM users
  ORDER BY id DESC
  LIMIT #{offset}, #{size}
</select>

<select id="countUsers" resultType="long">
  SELECT COUNT(*) FROM users
</select>`,
      },
      {
        type: "demo",
        kind: "page-query",
        title: "动手：分页参数",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pg1",
            question: "深分页 offset 过大问题？",
            options: ["没问题", "扫描浪费、变慢", "只影响 insert", "破坏事务"],
            answer: 1,
            explain: "游标/seek 分页更稳。",
          },
        ],
      },
    ],
  },
  {
    slug: "cache",
    title: "一级 / 二级缓存",
    summary: " intra-session 与 namespace 级。",
    level: "进阶",
    track: "工程化",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "记住边界",
        body: "一级缓存：同一 SqlSession，默认开。\n二级缓存：Mapper namespace，需显式开启，分布式易脏读。\n\n微服务 + Redis 场景：更常用业务缓存，而不是强依赖二级缓存。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ch1",
            question: "一级缓存作用域？",
            options: ["JVM 全局", "SqlSession", "HTTP Session", "浏览器"],
            answer: 1,
            explain: "会话级。",
          },
        ],
      },
    ],
  },
  {
    slug: "mybatis-plus",
    title: "MyBatis-Plus 对照",
    summary: "BaseMapper、条件构造器、别滥用。",
    level: "实战",
    track: "工程化",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "怎么选",
        body: "MP 提升 CRUD 效率：LambdaQueryWrapper、分页插件、自动填充。\n复杂报表 / 动态 SQL 仍建议 XML。\n\n面试可说：简单 CRUD 用 MP，复杂查询回归 MyBatis XML。",
      },
      {
        type: "code",
        title: "MP 风格",
        lang: "java",
        code: `// 伪代码示意
userMapper.selectList(
  Wrappers.<User>lambdaQuery()
    .eq(User::getStatus, 1)
    .like(User::getUsername, keyword)
);`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mp1",
            question: "复杂多表动态 SQL 更推荐？",
            options: ["只写 Wrapper", "MyBatis XML", "纯字符串拼 SQL", "不用数据库"],
            answer: 1,
            explain: "XML 可控可测。",
          },
        ],
      },
    ],
  },
  {
    slug: "best-practices",
    title: "工程实践清单",
    summary: "日志、分页、N+1、规范。",
    level: "实战",
    track: "工程化",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "上线前检查",
        body: "• 开发开 SQL 日志，生产关掉 StdOutImpl\n• 禁止 ${} 拼接用户输入\n• 分页必带上限\n• 警惕 N+1（嵌套 select）\n• Mapper 方法语义清晰：findBy / search / count\n• 大数据量批量操作分批 commit",
      },
      {
        type: "tip",
        body: "工坊模块会用模拟 REST 帮你走完 User/Article CRUD，把分层肌肉记忆练出来。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "bp1",
            question: "生产环境 SQL 日志？",
            options: ["永远 StdOutImpl", "按需 + 采样/级别控制", "必须打印完整参数到公网", "关闭所有日志"],
            answer: 1,
            explain: "安全与性能平衡。",
          },
        ],
      },
    ],
  },
  {
    slug: "interview",
    title: "面试高频串讲",
    summary: "#{}、缓存、插件、对比 JPA。",
    level: "实战",
    track: "面试串讲",
    minutes: 15,
    blocks: [
      {
        type: "text",
        title: "口述提纲",
        body: "1. MyBatis 是什么 / 与 Hibernate 差异\n2. #{} vs ${}\n3. 一级二级缓存\n4. 动态 SQL 标签\n5. 插件原理（Interceptor 责任链）\n6. 分页实现\n7. 延迟加载 / N+1\n8. 与 Spring 事务如何协作",
      },
      {
        type: "code",
        title: "插件接口印象",
        lang: "java",
        code: `@Intercepts({
  @Signature(type = Executor.class, method = "query",
    args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})
})
public class SqlCostInterceptor implements Interceptor {
  public Object intercept(Invocation inv) throws Throwable {
    long t0 = System.currentTimeMillis();
    try { return inv.proceed(); }
    finally { /* log cost */ }
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "iv1",
            question: "MyBatis 插件基于？",
            options: ["Servlet Filter", "Interceptor 责任链", "AOP 强制切所有类", "浏览器插件"],
            answer: 1,
            explain: "四大对象可拦截。",
          },
          {
            id: "iv2",
            question: "和 JPA 相比 MyBatis 优势？",
            options: ["完全不用 SQL", "SQL 可控、复杂查询友好", "自动分布式事务", "替代 Redis"],
            answer: 1,
            explain: "复杂 SQL / 优化空间大。",
          },
        ],
      },
    ],
  },
  {
    slug: "plugin",
    title: "插件与拦截器",
    summary: "Executor / StatementHandler 扩展点。",
    level: "进阶",
    track: "面试串讲",
    format: "reference",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "可拦截对象",
        body: "Executor、ParameterHandler、ResultSetHandler、StatementHandler。\n\n常见：分页、数据权限、SQL 耗时、加解密字段。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pl1",
            question: "分页插件常拦截？",
            options: ["Controller", "Executor / StatementHandler", "浏览器", "Nginx"],
            answer: 1,
            explain: "改写 SQL 与 count。",
          },
        ],
      },
    ],
  },
  {
    slug: "type-handler",
    title: "TypeHandler",
    summary: "Java 类型 ↔ JDBC 类型。",
    level: "进阶",
    track: "面试串讲",
    format: "reference",
    minutes: 8,
    blocks: [
      {
        type: "text",
        title: "用途",
        body: "枚举、JSON 列、加密字段：自定义 TypeHandler 在 setParameter / getResult 转换。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "th1",
            question: "TypeHandler 解决？",
            options: ["路由", "类型映射转换", "负载均衡", "前端校验"],
            answer: 1,
            explain: "JDBC ↔ Java。",
          },
        ],
      },
    ],
  },
];

export const TRACKS = [
  "基础",
  "Spring 整合",
  "动态 SQL",
  "关联与分页",
  "工程化",
  "面试串讲",
] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> = [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({ ...q, lessonSlug: lesson.slug, lessonTitle: lesson.title });
        }
      }
    }
  }
  return out;
}

export function isCourseLesson(l: Lesson): boolean {
  if (l.format === "reference") return false;
  if (l.format === "course") return true;
  return l.track !== "面试串讲" || l.format === "course";
}

// 主修：非 reference 都算；面试串讲里 format=reference 的不阻塞
export function getCourseLessons(): Lesson[] {
  return LESSONS.filter((l) => l.format !== "reference");
}
