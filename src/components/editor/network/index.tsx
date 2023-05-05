import { createUseStyles } from 'react-jss'
import { useContext, useState } from 'react'
import { Button, Modal } from 'antd'
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons'
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
    maxHeight: '70vh',
  }
})

function Network() {
  const classes = useStyles()

  const [selectedToDelete, setSelectedToDelete] = useState('')
  const [clearAllOpen, setClearAllOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('stepform')
  const [preview, setPreview] = useState('')

  const { networkStore, setNetworkStore } = useContext(EditorContext)

  const clearData = (name: string) => {
    // console.log('clearData:', name, networkStore)
    if (name !== 'all' && networkStore.indexOf(name) !== -1) {
      window.localStorage.removeItem("NETWORK_DEFINITION_" + name)
      setNetworkStore(networkStore.filter((ns) => ns !== name))
      setOpen(false)
    }
    else if (name === 'all') {
      networkStore.map(ns => window.localStorage.removeItem("NETWORK_DEFINITION_" + ns))
      setNetworkStore([] as string[])
      setClearAllOpen(false)
    }
  }

  const createNetwork = () => {
    setCurrent('stepform')
  }

  const renderRight = (type: string) => {
    switch(type) {
      case 'preview': 
        return (<div>Preview</div>)
      case 'stepform':
        return (<div>Create</div>)
    }
  }


  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <h3>
          My Networks
          <Button
            icon={<DeleteFilled />}
            type='text'
            shape='circle'
            style={{ marginLeft: 10 }}
            onClick={() => setClearAllOpen(true)}
          />
          <Modal
            title="Clear all networks"
            open={clearAllOpen}
            onCancel={() => setClearAllOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setClearAllOpen(false)}>
                Cancel
              </Button>,
              <Button key="ok" type="primary" onClick={() => clearData('all')}>
                OK
              </Button>,
            ]}
          >
            <p>Are you sure you want to delete all networks?</p>
          </Modal>
        </h3>
        <p style={{ padding: 0 }}>
          Create or select a network to visualize
        </p>
        {networkStore.map((ns:string)=> (
          <p key={ns}
            style={{ paddingLeft: 16, margin: 0 }}
          >
            <Button
              type='text'
              style={{ padding: 0, fontWeight: preview === ns ? 700 : 500 }}
              onClick={() => {
                setCurrent('preview')
                setPreview(ns)
              }}
            >
              {ns}
            </Button>
            <Button
              icon={<DeleteFilled />}
              type='text'
              shape='circle'
              style={{ marginLeft: 10 }}
              onClick={() => {
                setOpen(true)
                setSelectedToDelete(ns)
              }}
            />
            <Button
              icon={<EditFilled />}
              type='text'
              shape='circle'
              onClick={() => {
                setCurrent('stepform')
                setPreview(ns)
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

        <Button icon={<PlusOutlined />} onClick={createNetwork}>
          Create
        </Button>
      </div>
      <div className={classes.right}>
        {renderRight(current)}
      </div>
    </div>
  )
}

export default Network