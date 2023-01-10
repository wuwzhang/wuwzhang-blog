---
title: git
date: '2023-01-09'
tags: ['note', 'git']
draft: false
---

# git

![](https://static.vue-js.com/fe150520-f7af-11eb-991d-334fd31f0201.png)

## 配置

- git config [--global] user.name "[name]"
- git config [--global] user.email "[email address]"

### 日常基本操作

在日常工作中，代码常用的基本操作如下：

- git init 初始化仓库，默认为 master 分支
- git add . 提交全部文件修改到缓存区
- git add `<具体某个文件路径+全名>` 提交某些文件到缓存区
- git diff 查看当前代码 add 后，会 add 哪些内容
- git diff --staged 查看现在 commit 提交后，会提交哪些内容
- git status 查看当前分支状态
- git pull `<远程仓库名> <远程分支名>` 拉取远程仓库的分支与本地当前分支合并
- git pull `<远程仓库名> <远程分支名>:<本地分支名>` 拉取远程仓库的分支与本地某个分支合并
- git commit -m "`<注释>`" 提交代码到本地仓库，并写提交注释
- git commit -v 提交时显示所有 diff 信息
- git commit --amend [file1] [file2] 重做上一次 commit，并包括指定文件的新变化

关于提交信息的格式，可以遵循以下的规则：

- feat: 新特性，添加功能
- fix: 修改 bug
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理

### 分支操作

- git branch 查看本地所有分支
- git branch -r 查看远程所有分支
- git branch -a 查看本地和远程所有分支
- git merge `<分支名>` 合并分支
- git merge --abort 合并分支出现冲突时，取消合并，一切回到合并前的状态
- git branch `<新分支名>` 基于当前分支，新建一个分支
- git checkout --orphan `<新分支名>` 新建一个空分支（会保留之前分支的所有文件）
- git branch -D `<分支名>` 删除本地某个分支
- git push `<远程库名> :<分支名>` 删除远程某个分支
- git branch `<新分支名称> <提交 ID>` 从提交历史恢复某个删掉的某个分支
- git branch -m `<原分支名> <新分支名>` 分支更名
- git checkout `<分支名>` 切换到本地某个分支
- git checkout `<远程库名>/<分支名>` 切换到线上某个分支
- git checkout -b `<新分支名>` 把基于当前分支新建分支，并切换为这个分支

### 远程同步

远程操作常见的命令：

- git fetch [remote] 下载远程仓库的所有变动
- git remote -v 显示所有远程仓库
- git pull [remote] [branch] 拉取远程仓库的分支与本地当前分支合并
- git fetch 获取线上最新版信息记录，不合并
- git push [remote] [branch] 上传本地指定分支到远程仓库
- git push [remote] --force 强行推送当前分支到远程仓库，即使有冲突
- git push [remote] --all 推送所有分支到远程仓库

### 撤销

- git checkout [file] 恢复暂存区的指定文件到工作区
- git checkout [commit] [file] 恢复某个 commit 的指定文件到暂存区和工作区
- git checkout . 恢复暂存区的所有文件到工作区
- git reset [commit] 重置当前分支的指针为指定 commit，同时重置暂存区，但工作区不变
- git reset --hard 重置暂存区与工作区，与上一次 commit 保持一致
- git reset [file] 重置暂存区的指定文件，与上一次 commit 保持一致，但工作区不变

- git revert [commit] 后者的所有变化都将被前者抵消，并且应用到当前分支

> `reset`：真实硬性回滚，目标版本后面的提交记录全部丢失了

> `revert`：同样回滚，这个回滚操作相当于一个提价，目标版本后面的提交记录也全部都有

### 存储操作

你正在进行项目中某一部分的工作，里面的东西处于一个比较杂乱的状态，而你想转到其他分支上进行一些工作，但又不想提交这些杂乱的代码，这时候可以将代码进行存储

- git stash 暂时将未提交的变化移除
- git stash pop 取出储藏中最后存入的工作状态进行恢复，会删除储藏

- git stash list 查看所有储藏中的工作
- git stash apply `<储藏的名称>` 取出储藏中对应的工作状态进行恢复，不会删除储藏
- git stash clear 清空所有储藏中的工作
- git stash drop `<储藏的名称>` 删除对应的某个储藏

## fork, clone,branch 这三个概念，有什么区别?

- fork 则可以代表分叉、克隆 出一个（仓库的）新拷贝
  - 包含了原来的仓库（即 upstream repository，上游仓库）所有内容，如分支、Tag、提交
  - 如果想将你的修改合并到原项目中时，可以通过的 Pull Request 把你的提交贡献回 原仓库
- clone，译为克隆，它的作用是将文件从远程代码仓下载到本地，从而形成一个本地代码仓
- branch 特征与 fork 很类似，fork 得到的是一个新的、自己的代码仓，而 branch 得到的是一个代码仓的一个新分支

## 对 git stash 的理

stash，译为存放，在 git 中，可以理解为保存当前工作进度，会把暂存区和工作区的改动进行保存，这些修改会保存在一个栈上

后续你可以在任何时候任何分支重新将某次的修改推出来，重新应用这些更改的代码

默认情况下，git stash 会缓存下列状态的文件：

- 添加到暂存区的修改（staged changes）
- Git 跟踪的但并未添加到暂存区的修改（unstaged changes）

但以下状态的文件不会缓存：

- 在工作目录中新的文件（untracked files）
- 被忽略的文件（ignored files）

## git merge 和 git rebase 区别

- git merge

![](https://static.vue-js.com/9fdfa3e0-fdd4-11eb-991d-334fd31f0201.png)

会根据 master 和 bugfix 的共同祖先 B 和 D 、Y 生成 E

保留原有的分支结构和时间顺序

- git rebase

![](https://static.vue-js.com/b72aed70-fdd4-11eb-991d-334fd31f0201.png)

提取 x 和 y 的差异 x'、y' 追加到 D 后面

自己的提交永远在最前面，公共分支不建议使用 rebase

## git reset 和 git revert 的理解

git reset

reset 用于回退版本，可以遗弃不再使用的提交

git revert

在当前提交后面，新增一次提交，抵消掉上一次提交导致的所有变化，不会改变过去的历史，主要是用于安全地取消过去发布的提交

git pull 和 git fetch 的理解

- git pull = git fetch + git merge
