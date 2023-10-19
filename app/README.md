This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 启动

```bash
npm run dev
# or
yarn dev
```

## 关于合约

合约地址(programId)：EPtFrLBeq4sVLXYWx2CeioaDf2ADPByxg1mnTQCV1drG, 位于 [solana_twitter.json](./src/idl/solana_twitter.json) Line 763.

关于钱包的连接操作: [useWorkspace.ts](./src/hooks/useWorkspace.ts).

关于其他合约的操作在文件夹 `/pages/api/` 中。

Workflow: (后两步前端操作)

1. 在 api 中定义合约操作方法
2. 在 contexts 中调用 api 方法并做异常处理
3. 在 hooks 中对外提供方法
