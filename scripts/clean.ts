import path from 'path';
import fs from 'fs-extra';

(() => {
  const root = path.resolve(__dirname, '../');

  fs.removeSync(path.join(root, 'packages/common/lib'));
})();
