import { createUseStyles } from 'react-jss'
import { useState, useMemo } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { TableOutlined, CodeOutlined, DotChartOutlined } from '@ant-design/icons'

import Header from '../header'
import Data from './data'
import Network from './network'
import VisEditor from './vis'
import { EditorContext } from './context'
import { DataFile } from '../../../typings'

const useStyles = createUseStyles({
  root: {
    paddingTop: 30,
  }
})

const items: MenuProps['items'] = [
  {
    label: '1. Upload Data',
    key: 'data',
    icon: <TableOutlined />,
  },
  {
    label: '2. Specify Network',
    key: 'network',
    icon: <CodeOutlined />,
  },
  {
    label: '3. Choose Visualization',
    key: 'vis',
    icon: <DotChartOutlined />,
  }
];


function Editor() {
  const classes = useStyles()
  const [current, setCurrent] = useState('data')

  const loadedFiles = Object.keys(window.localStorage)
    .filter(k => k.startsWith("UPLOADED_FILE_"))
    .map((n) => {
      return {
        name: n.slice(14),
        hasHeader: true
      } as DataFile
    })
  const loadedNetworks = Object.keys(window.localStorage)
    .filter(k => k.startsWith("NETWORK_DEFINITION_"))
    .map(n => n.slice(19))

  const [fileNameStore, setFileNameStore] = useState(loadedFiles)
  const [networkStore, setNetworkStore] = useState(loadedNetworks)
  const editorContext = useMemo(
    () => ({ fileNameStore, setFileNameStore, networkStore, setNetworkStore }),
    [fileNameStore, networkStore]
  )

  const onClick: MenuProps['onClick'] = (e) => {
    // console.log('click ', e);
    setCurrent(e.key);
  };

  const renderComp = (step: string) => {
    switch (step) {
      case 'data': 
        return <Data />
      case 'network':
        return <Network />
      case 'vis':
        return <VisEditor />
    }
  }

  return (
    <EditorContext.Provider value={editorContext}>
      <Header />
      <div className={classes.root}>
        <Menu 
          onClick={onClick} 
          selectedKeys={[current]} 
          mode="horizontal" 
          items={items}
          style={{ fontSize: 17, marginBottom: 20}}
        />
        {renderComp(current)}
      </div>
    </EditorContext.Provider>
  )
}


export default Editor