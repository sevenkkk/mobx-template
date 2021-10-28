
## Installing

Using npm:

```bash
$ npm install wj-sdk-js
```

Using yarn:

```bash
$ yarn add wj-sdk-js
```

Using js:

```html
<script src="../wj-sdk-js/dist/wjsdk.js"></script>
```

## Example

```js
import { WjUpload } from 'wj-sdk-js';

// Uploading
WjUpload.upload(file, config).then();

// Global is used only once, not required
WjUpload.setUp(config); 

```
> **NOTE:** `async/await` is part of ECMAScript 2017 and is not supported in Internet
