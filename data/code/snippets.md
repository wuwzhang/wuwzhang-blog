---
title: sinppets
date: '2023-01-08'
tags: ['ES6', 'snippets']
draft: false
description: chrome书签格式化...
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## chrome 书签格式化

```js
const dfs = (children) => {
  return {
    title: children[0].innerText,
    data: [...children[1].children].slice(1).map((u) => {
      const tmp = [...u.children]

      return tmp.length === 1
        ? {
            title: tmp[0].innerText,
            url: tmp[0].href,
            date: new Date(+tmp[0].attributes.add_date.value * 1000)
              .toLocaleDateString()
              .split('/')
              .reverse()
              .join('-'),
          }
        : dfs(tmp)
    }),
  }
}

const format = () => {
  const arr = [...document.getElementsByTagName('dt')].filter(
    (v) => [...v.children][0].localName === 'h3'
  )

  return JSON.stringify(arr.slice(0, 1).map((v) => dfs([...v.children])))
}

format()
```
