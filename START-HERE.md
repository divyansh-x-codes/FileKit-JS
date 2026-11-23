# FileKit JS - Start Here

This project contains two parts:
- `filekit-js`: the actual JavaScript npm package.
- `filekit-demo`: a React website that uses and demonstrates the package.

## 1. Test the package

```bash
cd filekit-js
npm test
```

## 2. Install the React demo

From the project root:

```bash
cd filekit-demo
npm install
```

The React app uses the local package with `filekit-js: file:../filekit-js`.

## 3. Run React

```bash
npm run dev
```

Open the local URL printed by Vite.

## 4. Demo

Choose files, then click **Validate Selected Files**. It checks file type, size, image dimensions and clean file names. Files are not uploaded to a server.

## 5. Publish later

Publish only the `filekit-js` folder, not the React demo. Check whether the package name is available, update the author and repository details, run `npm test` and `npm pack --dry-run`, then use `npm login` and `npm publish` only when ready.

Client-side validation can be bypassed. A backend must validate files again before storing them.
