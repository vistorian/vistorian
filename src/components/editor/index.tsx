import { createUseStyles } from 'react-jss'
import { useState, useMemo } from 'react'
import { Divider, Button, Modal, message, Tooltip, Input } from 'antd'
import { DeleteFilled, CopyFilled, EditFilled } from '@ant-design/icons'
import Data from './data'
import Network from './network'
import VisEditor from './vis'
import { EditorContext } from './context'
import { DataFile, Template, OperationType } from '../../../typings'
import templates from '../templates/templates'
import Sessions from './sessions'
import { findIndex, filter, find } from 'lodash-es'
import Record from './record'
import DataPreview from './data/dataPreview'

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: '100%',
  },
  list: {
    width: 300,
    height: '100%',
    borderRight: '1px solid #d9d9d9',
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
    width: 170,
    overflow: "hidden",
    textOverflow: "ellipsis",
    '&:hover': {
      cursor: 'pointer'
    }
  },
  tabNameFocused: {
    width: 170,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: 700,
    backgroundColor: '#FFDF70',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  tabFunc: {
    display: "flex",
  }
})

function Editor() {
  const classes = useStyles()
  const [main, setMain] = useState('sessions')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [preview, setPreview] = useState<string>('')

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
  const [clearType, setClearType] = useState<OperationType>(null) 
  const [selectedToDelete, setSelectedToDelete] = useState<string>('')

  const handleSelectToDelete = (type: OperationType, name: string) => {
    setOpen(true)
    setClearType(type)
    setSelectedToDelete(name)
  }

  const handleDelete = (type: OperationType, name: string) => {
    if (type === 'data') {
      if (name !== 'all' && findIndex(fileNameStore, (fn: DataFile) => fn.name === name) !== -1) {
        window.localStorage.removeItem("UPLOADED_FILE_" + name)
        setFileNameStore(filter(fileNameStore, (fn) => fn.name !== name))
        message.success('The selected data has been successfully deleted!')
      }
      else if (name === 'all') {
        fileNameStore.map((fn: DataFile) => window.localStorage.removeItem("UPLOADED_FILE_" + fn.name))
        setFileNameStore([] as DataFile[])
        message.success('All data have been successfully deleted!')
      }
    }
    if (type === 'network') {
      if (name !== 'all' && networkStore.indexOf(name) !== -1) {
        window.localStorage.removeItem("NETWORK_DEFINITION_" + name)
        setNetworkStore(networkStore.filter((ns) => ns !== name))
        message.success('The selected network has been successfully deleted!')
      }
      else if (name === 'all') {
        networkStore.map(ns => window.localStorage.removeItem("NETWORK_DEFINITION_" + ns))
        setNetworkStore([] as string[])
        message.success('All networks have been successfully deleted!')
      }
    }
    setOpen(false)
  }

  // copy data or network
  const handleCopy = (type: OperationType, name: string) => {
    if (type === 'data') {
      const data = window.localStorage.getItem("UPLOADED_FILE_" + name)
      const idx = findIndex(fileNameStore, (fn) => fn.name === name)
      if (idx > -1 && data) {
        const newData = {...fileNameStore[idx]}
        // get only the name without file postfix
        const reg = /\.(.*)$/
        const split = name.split('').reverse().join('').split(reg)
        newData.name = `${split[1].split('').reverse().join('')}_copy.${split[0].split('').reverse().join('')}`
        window.localStorage.setItem("UPLOADED_FILE_" + newData.name, data)
        const tmp = [...fileNameStore]
        tmp.unshift(newData)
        setFileNameStore(tmp)
        message.success('The selected data has been successfully copied!')
      }
      else 
        message.error('No such data files in the cache!')
    }
    else if (type === 'network') {
      const data = window.localStorage.getItem("NETWORK_DEFINITION_" + name)
      const newName = `${name}_copy`
      if (data) {
        window.localStorage.setItem("NETWORK_DEFINITION_" + newName, data)
        const tmp = [...networkStore]
        tmp.unshift(newName)
        setNetworkStore(tmp)
        message.success('The selected network has been successfully copied!')
      }
      else 
        message.error('No such networks in the cache!')
    }
  }

  // rename data or network
  const handleRename = (type: OperationType, oldName: string, newName: string) => {
    if (type === 'data') {
      // TODO: examine the postfix to be .csv/.tsv/...
      if (newName.length < 1) {
        message.error("The data must have a name!")
        return false
      }
      else if (findIndex(fileNameStore, (fn: DataFile) => fn.name === newName) !== -1) {
        message.error("The new data name has existed!")
        return false
      }
      else {
        const idx = findIndex(fileNameStore, (fn: DataFile) => fn.name === oldName)
        const result = window.localStorage.getItem("UPLOADED_FILE_" + oldName)
        if (idx !== -1 && result) {
          const tmp = [...fileNameStore]
          tmp[idx].name = newName
          setFileNameStore(tmp)
          window.localStorage.removeItem("UPLOADED_FILE_" + oldName)
          window.localStorage.setItem("UPLOADED_FILE_" + newName, result)
          message.success('The selected data has been successfully renamed!')
          return true
        }
        else {
          message.error('No such data in the cache!')
          return false
        }
      }
    }
    else if (type === 'network') {
      if (newName.length < 1) {
        message.error("The network must have a name!")
        return false
      }
      else if (networkStore.indexOf(newName) !== -1) {
        message.error("The new network name has existed!")
        return false
      }
      else {
        const idx = networkStore.indexOf(oldName)
        const result = window.localStorage.getItem("NETWORK_DEFINITION_" + oldName)
        if (idx !== -1 && result) {
          const tmp = [...networkStore]
          tmp[idx] = newName
          setNetworkStore(tmp)
          window.localStorage.removeItem("NETWORK_DEFINITION_" + oldName)
          window.localStorage.setItem("NETWORK_DEFINITION_" + newName, result)
          message.success('The selected network has been successfully renamed!')
          return true
        }
        else {
          message.error('No such network in the cache!')
          return false
        }
      }
    }
    return false
  }

  const showPreview = (type: OperationType, name: string) => {
    if (type === 'data') {
      setMain('dataPreview')
      setPreview(name)
    }
    else if (type === 'network') {
      setMain('networkPreview')
      setPreview(name)
    }
  }

  const renderComp = (content: string) => {
    switch (content) {
      // case 'data': 
      //   return <Data />
      case 'dataPreview': 
        const fileName = find(fileNameStore, (fn: DataFile) => fn.name === preview) as DataFile
        return <DataPreview preview={fileName}/>
      case 'network':
        return <Network moveToVis={setMain} setSelectedNetwork={setSelectedNetwork}/>
      case 'networkPreview': 
        return <div>Network Preview {preview}</div>
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
              onClick={()=>{
                setMain('sessions')
                setPreview('')
              }}
            >
              My Sessions
            </Button>
            <Button 
              type='primary' 
              style={{ marginBottom: 10, marginRight: 10 }}
              onClick={() => { 
                setMain('network') 
                setPreview('')
              }}
            >
              Create New Networks
            </Button>
          </div>
          
          {/* My networks */}
          <div className={classes.tab}>
            <div className={classes.tabHeader}>
              <span className={classes.tabTitle}>My Networks</span>
              <Tooltip title="Clear all networks">
                <Button
                  icon={<DeleteFilled />}
                  type='text'
                  shape='circle'
                  onClick={() => handleSelectToDelete('network', 'all')}
                />
              </Tooltip>
            </div>
            {networkStore.map((network: string) => 
              <Record 
                key={network}
                data={network}
                type="network"
                handleRename={handleRename}
                handleCopy={handleCopy}
                handleSelectToDelete={handleSelectToDelete}
                showPreview={showPreview}
                selectedPreview={`${main}-${preview}`}
              />
            )}
            
          </div> 
          <Divider style={{ margin: '15px 0px'}} />
          
          {/* My data */}
          <div className={classes.tab}>
            <div className={classes.tabHeader}>
              <span className={classes.tabTitle}>My Data</span>
              <Tooltip title="Clear all data">
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
              </Tooltip>
            </div>
            {fileNameStore.map((fileName: DataFile) => (
              <Record
                key={fileName.name}
                data={fileName.name}
                type="data"
                handleRename={handleRename}
                handleCopy={handleCopy}
                handleSelectToDelete={handleSelectToDelete}
                showPreview={showPreview}
                selectedPreview={`${main}-${preview}`}
              />
            ))}
          </div> 
          <Divider style={{ margin: '15px 0px'  }} />
          
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

          {/* visualization library */}
          <div className={classes.tab}>
            <div className={classes.tabHeader}>
              <span className={classes.tabTitle}>Visualization Library</span>
            </div>
            {templates.map((template: Template) => (
              <div className={classes.tabContent} key={template.key}>
                <Tooltip placement="topLeft" title={template.label}>
                  <span className={classes.tabName}>{template.label}</span>
                </Tooltip>
              </div>
            ))}
          </div> 
          
        </div>
        <div className={classes.main}>
          {renderComp(main)}
        </div>
      </div>
    </EditorContext.Provider>
  )
}


export default Editor