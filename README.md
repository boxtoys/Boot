# BootKit

Quick setup toolkit for new developers

## Features

- Data storage based on Google Sheets.
- API based on Vercel Serverless Functions.
- Data cache use LocalStorage & ServiceWorker.

## Deploy

1. Fork this project.
2. Create a new project in vercel dashboard and connect to your project.
3. Create Google Cloud platform credentials keyFile & extract `client_email`, `private_key` field. set sheet name to `Sheet1`.
4. Set environment variables in the project dashboard.

## ENV

Environment variables required by the project.

| Key          | Value  | Description                              |
| ------------ | ------ | ---------------------------------------- |
| TOKEN        | String | access token                             |
| SHEET_ID     | String | Google Sheets ID                         |
| CLIENT_EMAIL | String | credentials keyFile `client_email` field |
| PRIVATE_KEY  | String | credentials keyFile `private_key` field  |

**Note:**

- Recommended `TOKEN` env is generated use `crypto.randomBytes(16).toString('hex')`
- Environment variables are best added using the vercel client, use the Web UI can be problematic

## Sheet Structure

```
| Category(A) | Name(B) | Icon(C)                      | Path/Desc(D) | Command(E) | Website(F)          | Round(G) |
| ----------- | ------- | ---------------------------- | ------------ | ---------- | ------------------- | -------- |
| app         | example | https://example.com/logo.png | /example.app |            | https://example.com | 1        |
| command     | example | https://example.com/logo.png | demo         | example    | https://example.com | 0        |
```

## APIs

### {domain}/api/list ![get](https://img.shields.io/badge/HTTP-GET-orange)

Get all data in data storage.

| Parameter | Type   | Description  | isRequired? |
| --------- | ------ | ------------ | ----------- |
| token     | String | access token | required    |

```js
const result = await axios.get(`${domain}/api/list`, {
  params: {
    token: "74e1dcd881627ee5efa73340324ee47f",
  },
});

console.log(result);
// output log:
// [
//    { name: 'example', icon: 'https://example.com/logo.png', path: '/Applications/example.app', website: 'https://example.com', category: 'app', round: 1 },
//    { name: 'example', icon: 'https://example.com/logo.png', desc: 'demo', command: 'example', website: 'https://example.com', category: 'command', round: 1 }
// ]
```

## Related Documentation

[Vercel functions using environment variables](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart#using-environment-variables)

[Create Google Cloud platform credentials keyFile](https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9)

## License

[MIT](LICENSE).
