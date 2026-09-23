#!/usr/bin/env node
// 一次性迁移脚本:把 static/qurious/q*.js 转为 content/qurious/issue-*/index.md
// 用法: node scripts/migrate-qurious.js
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../static/qurious');
const DEST = path.resolve(__dirname, '../content/qurious');

/**
 * 通过 new Function 沙箱执行源 JS,只读不污染全局
 */
function parseIssue(src) {
  // 去掉开头空白和 const ISSUE = 前缀
  const cleaned = src.replace(/^\s*const\s+ISSUE\s*=\s*/, '');
  // 去掉结尾可能的分号
  const cleanedEnd = cleaned.replace(/;\s*$/, '');
  const wrap = `return (${cleanedEnd});`;
  try {
    return new Function(wrap)();
  } catch (e) {
    console.error('  解析错误:', e.message);
    return null;
  }
}

/**
 * 中文日期 "2026年5月13日" -> "2026-05-13"
 */
function parseDate(s) {
  const m = s && s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!m) return '2026-01-01';
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}

function yamlStr(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildMarkdown(issue) {
  const date = parseDate(issue.date);
  const yamlQ = issue.questions.map((q) => {
    const thinkingYaml = q.thinking.map((t) => `\n      - "${yamlStr(t)}"`).join('');
    return `  - text: "${yamlStr(q.text)}"
    source: "${yamlStr(q.source)}"
    difficulty: "${yamlStr(q.difficulty)}"
    thinking:${thinkingYaml}`;
  }).join('\n');

  const topicsSet = new Set();
  const sourcesSet = new Set();
  issue.questions.forEach((q) => {
    if (q.difficulty) topicsSet.add(q.difficulty);
    if (q.source) sourcesSet.add(q.source.replace(/^来自\s*/, '').trim());
  });

  return `---
title: "第 ${issue.num} 期 · ${issue.intro}"
issue_number: "${issue.num}"
date: ${date}
weekday: "${issue.weekday || ''}"
season: "Season 01"
intro: "${yamlStr(issue.intro)}"
hero_quote: ""
duration: "18 min"
audio_url: ""
audio_platforms: {}
topics: ${JSON.stringify([...topicsSet])}
sources: ${JSON.stringify([...sourcesSet])}
layout: "qurious-single"
questions:${issue.questions.map((q) => `
  - text: "${yamlStr(q.text)}"
    source: "${yamlStr(q.source)}"
    difficulty: "${yamlStr(q.difficulty)}"
    thinking:${q.thinking.map((t) => `
      - "${yamlStr(t)}"`).join('')}`).join('')}
---

# 第 ${issue.num} 期 · ${issue.intro}

${issue.date} · ${issue.weekday || ''}

## 本期引言

${issue.intro}

## 五个问题

本期共 ${issue.questions.length} 个问题,由模板从 front matter 渲染。
`;
}

function main() {
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

  const files = fs.readdirSync(SRC).filter((f) => /^q\d+\.js$/.test(f)).sort();
  let count = 0;
  for (const f of files) {
    const src = fs.readFileSync(path.join(SRC, f), 'utf8');
    const issue = parseIssue(src);
    if (!issue || !issue.num) {
      console.error(`跳过 ${f}:解析失败`);
      continue;
    }
    const num = issue.num.padStart(3, '0');
    const dir = path.join(DEST, `issue-${num}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.md'), buildMarkdown(issue));
    console.log(`✓ ${f} → content/qurious/issue-${num}/index.md (${issue.questions.length} 个问题)`);
    count++;
  }
  console.log(`\n完成:共迁移 ${count} 期。`);
}

main();
