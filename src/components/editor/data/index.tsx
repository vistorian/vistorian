import { createUseStyles } from 'react-jss'
import { useState, useContext } from 'react'
import { MenuProps } from 'antd'
import { Menu, Button, Modal } from 'antd'
import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import { filter } from 'lodash-es'

import UploadFiles from './upload'
import Paste from './paste'
import Download from './download'
import DataPreview from './dataPreview'
import { EditorContext } from '../context'

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    width: '100%',
  },
  left: {
    width: 250,
  },
  right: {
    margin: '0px 20px',
    width: '100%',
    maxWidth: 600,
  }
})

function Data() {
  const classes = useStyles()
  const [current, setCurrent] = useState('file')
  const [open, setOpen] = useState(false)

  const { fileNameStore, setFileNameStore } = useContext(EditorContext);

  const items: MenuProps['items'] = [
    {
      label: 'Upload File',
      key: 'file',
      icon: <PlusOutlined />,
    },
    {
      label: 'Paste Data',
      key: 'paste',
      icon: <PlusOutlined />,
    },
    {
      label: 'Download from URL',
      key: 'download',
      icon: <PlusOutlined />,
    }
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    // console.log('click ', e);
    setCurrent(e.key);
  }

  const clearData = (name: string) => {
    // console.log('clearData:', name, fileNameStore)
    setOpen(false)
    if (name !== 'all') {
      window.localStorage.removeItem("UPLOADED_FILE_" + name)
      setFileNameStore(filter(fileNameStore, (fn) => fn === name))
    }
    else {
      window.localStorage.clear()
      setFileNameStore([] as string[])
    }
  }
  
  const handleCancel = () => {
    setOpen(false)
  } 

  const renderRight = (type: string) => {
    switch (type) {
      case 'file':
        return <UploadFiles />
      case 'paste':
        return <Paste />
      case 'download':
        return <Download />
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          items={items}
          style={{ fontSize: 16 }}
        />
        <p style={{fontSize: 18, fontWeight: 700, paddingLeft: 16}}>
          Saved Data
          <Button 
            icon={<DeleteFilled />} 
            type='text'
            shape='circle'
            style={{ marginLeft: 10 }}
            onClick={() => setOpen(true)} 
          />
          <Modal
            title="Delete Files"
            open={open}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="ok" type="primary" onClick={() => clearData('all')}>
                OK
              </Button>,
            ]}
          >
            <p>Are you sure you want to delete all uploaded files?</p>
          </Modal>
        </p>
        {fileNameStore.map((fileName: string) => (
          <p style={{ paddingLeft: 16, margin: 0 }}>
            {fileName}
            <Button
              icon={<DeleteFilled />}
              type='text'
              shape='circle'
              style={{ marginLeft: 10 }}
              onClick={() => setOpen(true)}
            />
            <Modal
              title="Delete Files"
              open={open}
              onCancel={handleCancel}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="ok" type="primary" onClick={() => clearData(fileName)}>
                  OK
                </Button>,
              ]}
            >
              <p>Are you sure you want to delete {fileName} ?</p>
            </Modal>
          </p>
        ))}
      </div>
      <div className={classes.right}>
        {renderRight(current)}
      </div>
    </div>
  )
}

export default Data