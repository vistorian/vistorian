import { createUseStyles } from 'react-jss'
import { useState, useContext, useMemo } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { TableOutlined, CodeOutlined, DotChartOutlined } from '@ant-design/icons'

import Header from '../header'
import Data from './data'
import Network from './network'
import VisEditor from './vis'
import { EditorContext } from './context'

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
    label: '3. Specify Visualization',
    key: 'vis',
    icon: <DotChartOutlined />,
  }
];


function Editor() {
  const classes = useStyles()
  const [current, setCurrent] = useState('data')
  const [fileNameStore, setFileNameStore] = useState([] as string[])
  const editorContext = useMemo(
    () => ({ fileNameStore, setFileNameStore }),
    [fileNameStore]
  );

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