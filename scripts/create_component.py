import os
import sys

component_name = sys.argv[1]

component_text = f'''import * as React from 'react'
import styled from 'styled-components'

interface IProps {{

}}

const {component_name} = (props: IProps) => {{

}}

export default {component_name}
'''

folder_path = f'src/components/{component_name}'
file_path = f'{folder_path}/{component_name}.tsx'
index_path = 'src/components/index.ts'

if not os.path.exists(folder_path):
    os.makedirs(folder_path)

    open(file_path, 'w').write(component_text)
    open(index_path, 'a').write(f"export {{ default as {component_name} }} from './{component_name}/{component_name}'\n")
else:
    print('ERROR: Component already exists')
