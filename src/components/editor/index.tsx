import { createUseStyles } from 'react-jss'
import { useState, useMemo } from 'react'
import { Divider, Button, Modal, message } from 'antd'
import { DeleteFilled, CopyFilled, EditFilled } from '@ant-design/icons'
import Data from './data'
import Network from './network'
import VisEditor from './vis'
import { EditorContext } from './context'
import { DataFile, Template } from '../../../typings'
import templates from '../templates/templates'
import Sessions from './sessions'
import { findIndex, filter } from 'lodash-es'

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: '100%',
  },
  list: {
    width: 300,
    height: '100%',
    borderRight: '1px solid rgba(5, 5, 5, 0.06)',
    marginRight: 20,
  },
  main: {
    width: "calc(100% - 320px)",
    maxHeight: '95vh',
    overflow: 'scroll'
  },
  header: {
    display: "flex",
    flexDirection: "column",
  },
  tab: {
    padding: 10,
    height: 'calc((100% - 300px)/3)',
    overflow: 'scroll'
  },
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    MarginBottom: 5,
    lineHeight: "2.5em",
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  tabContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    lineHeight: "2em",
  },
  tabName: {

  },
  tabFunc: {
    display: "flex",
  }
})

type ClearType = "data" | "network" | null

function Editor() {
  const classes = useStyles()
  const [current, setCurrent] = useState('sessions')
  const [selectedNetwork, setSelectedNetwork] = useState('')

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

  // clear data or network
  const [open, setOpen] = useState<boolean>(false)
  const [clearType, setClearType] = useState<ClearType>(null) 
  const [selectedToDelete, setSelectedToDelete] = useState<string>('')

  const handleDelete = (type: ClearType, name: string) => {
    if (type === 'data') {
      if (name !== 'all' && findIndex(fileNameStore, (fn: DataFile) => fn.name === name) !== -1) {
        window.localStorage.removeItem("UPLOADED_FILE_" + name)
        setFileNameStore(filter(fileNameStore, (fn) => fn.name !== name))
      }
      else if (name === 'all') {
        fileNameStore.map((fn: DataFile) => window.localStorage.removeItem("UPLOADED_FILE_" + fn.name))
        setFileNameStore([] as DataFile[])
      }
    }
    if (type === 'network') {
      if (name !== 'all' && networkStore.indexOf(name) !== -1) {
        window.localStorage.removeItem("NETWORK_DEFINITION_" + name)
        setNetworkStore(networkStore.filter((ns) => ns !== name))
      }
      else if (name === 'all') {
        networkStore.map(ns => window.localStorage.removeItem("NETWORK_DEFINITION_" + ns))
        setNetworkStore([] as string[])
      }
    }
    setOpen(false)
  }

  const renderComp = (step: string) => {
    switch (step) {
      // case 'data': 
      //   return <Data />
      case 'network':
        return <Network moveToVis={setCurrent} setSelectedNetwork={setSelectedNetwork}/>
      // case 'vis':
      //   return <VisEditor name={selectedNetwork}/>
      case 'sessions':
        return <Sessions />
    }
  }

  return (
    <EditorContext.Provider value={editorContext}>
      <div className={classes.root}>
        <div className={classes.list}>
          <div className={classes.header}>
            <a href="./" style={{ marginBottom: "20px", }}>
              <img src="./logos/logo-vistorian.png" style={{ width: 200 }} />
            </a>
            <Button  
              type='primary' 
              style={{ marginBottom: 10, marginRight: 10 }}
              onClick={()=>{setCurrent('sessions')}}
            >
              My Sessions
            </Button>
            <Button 
              type='primary' 
              style={{ marginBottom: 10, marginRight: 10 }}
              onClick={() => { setCurrent('network') }}
            >
              Create New Networks
            </Button>
          </div>

          <div className={classes.tab}>
            <div className={classes.tabHeader}>
              <span className={classes.tabTitle}>My Networks</span>
              <Button
                icon={<DeleteFilled />}
                type='text'
                shape='circle'
                onClick={()=>{ 
                  setOpen(true)
                  setClearType('network')
                  setSelectedToDelete('all')
                 }}
              />
            </div>
            {networkStore.map((network: string) => (
              <div className={classes.tabContent} key={network}>
                <span className={classes.tabName}>{network}</span>
                <div className={classes.tabFunc}>
                  <Button
                    icon={<EditFilled />}
                    type='text'
                    shape='circle'
                  />
                  <Button
                    icon={<CopyFilled />}
                    type='text'
                    shape='circle'
                  />
                  <Button
                    icon={<DeleteFilled />}
                    type='text'
                    shape='circle'
                    onClick={() => {
                      setOpen(true)
                      setClearType('network')
                      setSelectedToDelete(network)
                    }}
                  />
                </div>
              </div>
            ))}
            
          </div> 
          <Divider style={{ margin: '15px 0px'}} />
          

          <div className={classes.tab}>
            <div className={classes.tabHeader}>
              <span className={classes.tabTitle}>My Data</span>
              <Button
                icon={<DeleteFilled />}
                type='text'
                shape='circle'
                onClick={() => {
                  setOpen(true)
                  setClearType('data')
                  setSelectedToDelete('all')
                }}
              />
            </div>
            {fileNameStore.map((fileName: DataFile) => (
              <div className={classes.tabContent} key={fileName.name}>
                <span className={classes.tabName}>{fileName.name}</span>
                <div className={classes.tabFunc}>
                  <Button
                    icon={<EditFilled />}
                    type='text'
                    shape='circle'
                  />
                  <Button
                    icon={<CopyFilled />}
                    type='text'
                    shape='circle'
                  />
                  <Button
                    icon={<DeleteFilled />}
                    type='text'
                    shape='circle'
                    onClick={() => {
                      setOpen(true)
                      setClearType('data')
                      setSelectedToDelete(fileName.name)
                    }}
                  />
                </div>
              </div>
            ))}
          </div> 
          <Divider style={{ margin: '15px 0px' }} />
          
          {/* modal for delete data/network */}
          <Modal
            title={`Delete ${clearType}`}
            open={open}
            onCancel={() => setOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setOpen(false)}>
                Cancel
              </Button>,
              <Button key="ok" type="primary" onClick={() => handleDelete(clearType, selectedToDelete)}>
                OK
              </Button>
            ]}
          >
            <p>Are you sure you want to delete {selectedToDelete === 'all' ? `all the ${clearType}`: selectedToDelete} ?</p>
          </Modal>

          <div className={classes.tab}>
            <div className={classes.tabHeader}>
              <span className={classes.tabTitle}>Visualization Library</span>
            </div>
            {templates.map((template: Template) => (
              <div className={classes.tabContent} key={template.key}>
                <span className={classes.tabName}>{template.label}</span>
              </div>
            ))}
          </div> 
          
        </div>
        <div className={classes.main}>
          {renderComp(current)}
        </div>
      </div>
    </EditorContext.Provider>
  )
}


export default Editor