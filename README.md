# Java + MyBatis 实战学习

交互式中文 **Java MyBatis / Spring Boot 整合** 教程：课程 + 测验 + 进度 + Mapper 沙箱 + REST 工坊。

**在线访问：** [https://xiaoqianran.github.io/learning-java-mybatis/](https://xiaoqianran.github.io/learning-java-mybatis/)  
**仓库：** [https://github.com/xiaoqianran/learning-java-mybatis](https://github.com/xiaoqianran/learning-java-mybatis)  
（姊妹项目 [learning-vue3](https://github.com/xiaoqianran/learning-vue3)）

---

## 这是什么

面向想系统掌握 **MyBatis**（注解 + XML）、并快速上手 **Spring Boot 整合** 的同学。内容以「读一点、动手一点、测一点」组织，而不是纯文档站。

你可以：

- 按路径学完主修课（**讲解 + 对应源码 + 交互 Demo + 小测验**）
- 在 **Mapper 沙箱** 里演练动态 SQL 展开
- 在 **REST 工坊** 里完成 User / Article CRUD 闯关（模拟 SQL 日志）
- 用 **速查表 / 文档地图 / 学习中心 / 错题本 / 结业证明** 跟进度

> 本站用 React + TanStack Start 承载教学内容（与 learning-vue3 同一套产品形态）。

---

## 功能一览

| 模块 | 路径 | 说明 |
|------|------|------|
| 课程 | `/lesson/:slug` | 正文、源码、Demo、测验、笔记 |
| 首页大纲 | `/` | 搜索、路径筛选、进度条 |
| Mapper 沙箱 | `/playground` | 动态 SQL 演练 |
| REST 工坊 | `/studio` | 模拟 Mapper + SQL 日志闯关 |
| 文档地图 | `/docs` | 官方文档 ↔ 本站课 |
| 主题 | 全局 | Catppuccin（Mocha/… + Accent） |
| 速查表 | `/cheatsheet` | 一页核心 API |
| 学习中心 | `/hub` | 打卡、收藏、路径进度 |
| 练习场 | `/lab` | 综合刷题 |
| 错题本 | `/mistakes` | 测验错题回顾 |
| 结业证明 | `/certificate` | 主修掌握后解锁 |

---

## 学习路径

| 路径 | 你学到什么 |
|------|------------|
| **基础** | 配置、#{} vs ${}、注解 CRUD、ResultMap、参数 |
| **Spring 整合** | starter、分层、事务 |
| **动态 SQL** | if / where / choose / set / foreach |
| **关联与分页** | association、collection、LIMIT |
| **工程化** | 缓存、MyBatis-Plus 对照、实践清单 |
| **面试串讲** | 高频题、插件、TypeHandler |

---

## 本地运行

```bash
git clone https://github.com/xiaoqianran/learning-java-mybatis.git
cd learning-java-mybatis
npm install
npm run dev
```

开发服务：`0.0.0.0:8080`。GitHub Pages 构建设置 `GITHUB_PAGES=true`，`base` 为 `/learning-java-mybatis/`。

---

## 技术栈

- React 19、TanStack Start / Router、Vite
- Tailwind CSS v4、Catppuccin 主题
- Zustand（学习进度持久化）
- GitHub Actions → GitHub Pages

---

## 部署

推送到 `main` 后，Actions **Deploy to GitHub Pages** 自动发布。

- Pages 源：GitHub Actions  
- 站点：`https://xiaoqianran.github.io/learning-java-mybatis/`
