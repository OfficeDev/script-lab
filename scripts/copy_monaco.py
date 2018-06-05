import os
import shutil

from_path = './node_modules/monaco-editor/min/vs'
to_path = './public/vs'


if (os.path.exists(to_path)):
    shutil.rmtree(to_path)

shutil.copytree(from_path, to_path)
