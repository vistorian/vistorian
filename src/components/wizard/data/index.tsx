import { createUseStyles } from 'react-jss'
import { useState, useContext } from 'react'
import { MenuProps } from 'antd'
import { Menu, Button, Modal, message } from 'antd'
import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import { filter } from 'lodash-es'
import { HANDLEALL } from '../../../../typings/constant'
import UploadFiles from './upload'
import Paste from './paste'
import Download from './download'
import { WizardContext } from '../context'
import { findIndex } from 'lodash-es'

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
  }
})

function Data() {
  const classes = useStyles()

  const [current, setCurrent] = useState('file')
  const [clearAllOpen, setClearAllOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedToDelete, setSelectedToDelete] = useState('')
  const [preview, setPreview] = useState({} as DataFile)

  const { fileNameStore, setFileNameStore } = useContext(WizardContext)

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
    if (name !== HANDLEALL && findIndex(fileNameStore, (fn: DataFile) => fn.name === name) !== -1) {
      window.localStorage.removeItem("UPLOADED_FILE_" + name)
      setFileNameStore(filter(fileNameStore, (fn) => fn.name !== name))
      setOpen(false)
    }
    else if (name === HANDLEALL) {
      fileNameStore.map((fn: DataFile) => window.localStorage.removeItem("UPLOADED_FILE_" + fn.name))
      setFileNameStore([] as DataFile[])
      setClearAllOpen(false)
    }
  }

  const checkDuplicate = (name: string) => {
    if (findIndex(fileNameStore, (fn: DataFile) => fn.name === name) > -1) {
      message.error(`${name} file upload failed, as the system does not allow data files uploaded with the same name.`)
      return false
    }
    return true
  }

  const renderRight = (type: string) => {
    switch (type) {
      case 'file':
        return <UploadFiles 
          setPreview={setPreview}
          setCurrent={setCurrent}
          checkDuplicate={checkDuplicate}
        />
      case 'paste':
        return <Paste 
          setPreview={setPreview}
          setCurrent={setCurrent}
          checkDuplicate={checkDuplicate}
        />
      case 'download':
        return <Download />
      // case 'preview':
      //   return <DataPreview 
      //     selectedData={preview}
      //     setPreview={setPreview}
      //   />
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
            onClick={() => setClearAllOpen(true)} 
          />
          <Modal
            title="Clear all data files"
            open={clearAllOpen}
            onCancel={() => setClearAllOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setClearAllOpen(false)}>
                Cancel
              </Button>,
              <Button key="ok" type="primary" onClick={() => clearData(HANDLEALL)}>
                OK
              </Button>,
            ]}
          >
            <p>Are you sure you want to delete all uploaded files?</p>
          </Modal>
        </p>
        {fileNameStore.map((fileName: DataFile) => (
            <p key={fileName.name}
              style={{ paddingLeft: 16, margin: 0 }}
            >
              <Button
                type='text'
                style={{ padding: 0, fontWeight: preview.name === fileName.name ? 700 : 500 }}
                onClick={() => {
                  setCurrent('preview')
                  setPreview(fileName)
                }}
              >
                {fileName.name}
              </Button>
              <Button
                icon={<DeleteFilled />}
                type='text'
                shape='circle'
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setOpen(true)
                  setSelectedToDelete(fileName.name)
                }}
              />
            </p>
        ))}
        <Modal
          title="Delete Files"
          open={open}
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setOpen(false)}>
              Cancel
            </Button>,
            <Button key="ok" type="primary" onClick={() => clearData(selectedToDelete)}>
              OK
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete {selectedToDelete} ?</p>
        </Modal>
      </div>
      <div className={classes.right}>
        {renderRight(current)}
      </div>
    </div>
  )
}

export default Data