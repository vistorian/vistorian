import { createUseStyles } from 'react-jss'
import { useState, useMemo, useEffect } from 'react'
import { Divider, Button, Modal, Tooltip } from 'antd'
import { DeleteFilled, FileAddFilled } from '@ant-design/icons'
import Network from './network/index'
import VisSelector from './visSelector'
import { WizardContext } from './context'
import { OperationType } from '../../../typings'
import { HANDLEALL, defaultDatasets, defaultNetworks } from '../../../typings/constant'
import Sessions from './session'
import { find } from 'lodash-es'
import Record from './record'
import DataPreview from './data/dataPreview'
import { handleCopy, handleDelete, handleRename, isDataInNetwork, updateNetworkAndSessionIfDeleteData, updateNetworkIfRenameData, updateSessionIfDeleteNet, updateSessionIfRenameNet } from './utils'
import NetworkPreview from './network/networkPreview'
import NewSession from './session/newSession'

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: '100%',
    color: '#333',
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
    height: 'calc((100% - 300px)/2)',
    overflow: 'scroll'
  },
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 5,
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
  // tabName: { /// BEN: THEY DO NOT SEEM TO BE USED HERE.
  //   width: 170,
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   '&:hover': {
  //     cursor: 'pointer'
  //   },
  //   padding: '200px'
  // },
  // tabNameFocused: {
  //   width: 170,
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   fontWeight: 700,
  //   backgroundColor: '#FFDF70',
  //   '&:hover': {
  //     cursor: 'pointer'
  //   }
  // },
  tabFunc: {
    display: "flex",
  }
})

function Wizard() {
  const classes = useStyles()
  // define which component is rendered in the right panel
  const [main, setMain] = useState('sessions')
  // which data/network is previewing
  const [preview, setPreview] = useState<string>('')
  // select a network for visualizing
  const [selectedNetwork, setSelectedNetwork] = useState<string>('')
  // when creating a new session, decide on network source
  // true for select an existing one, false for upload a new one
  const [netSource, setNetSource] = useState<boolean|undefined>()
  // whenever clicking create a visualization, trigger re-mounting the component
  const [triggerReMount, setTriggerReMount] = useState<number>(123)

  
  /**
   * @description
   * @param {string[]} files: an array of file names
   */
  async function loadAndStoreFiles(files: string[]) {
    for (const filename of files) {
      const response = await fetch(`./data/${filename}`)
      const text = await response.text()
      window.localStorage.setItem(filename, text)
    }
  }

  /**
   * @description: load the default files to cache at the first time using the Vistorian
   */
  useEffect(() => {
    let filesToStore = Array.from(defaultDatasets).map(d =>`UPLOADED_FILE_${d}`)
    // filesToStore.push(...Array.from(defaultDatasets).map(d => `UPLOADED_FILEINFO_${d}`))
    filesToStore.push(...Array.from(defaultNetworks).map(n =>`NETWORK_WIZARD_${n}`))
    // console.log('filesToStore', filesToStore)
    loadAndStoreFiles(filesToStore)
  }, []);

  const loadedFiles = Object.keys(window.localStorage)
    .filter(k => k.startsWith("UPLOADED_FILE_"))
    .map(n => n.slice(14))

  const loadedNetworks = Object.keys(window.localStorage)
    .filter(k => k.startsWith("NETWORK_WIZARD_"))
    .map(n => n.slice(15))

  const loadedSessions = Object.keys(window.localStorage)
    .filter(k => k.startsWith("SAVED_SESSION_"))
    .map((n) => {
      const sessionStr = window.localStorage.getItem(n)
      if (sessionStr) {
        return JSON.parse(sessionStr)
      }
      return null
    })

  // handle the initialization based on the cache
  const [fileNameStore, setFileNameStore] = useState(loadedFiles)
  const [networkStore, setNetworkStore] = useState(loadedNetworks)
  const [sessionStore, setSessionStore] = useState(loadedSessions)
  const wizardContext = useMemo(
    () => ({ fileNameStore, setFileNameStore, networkStore, setNetworkStore, sessionStore, setSessionStore }),
    [fileNameStore, networkStore, sessionStore]
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

  const toDelete = () => {
    const store = clearType === 'network' ? networkStore : fileNameStore
    const newStore = handleDelete(clearType, selectedToDelete, store)
    if (clearType === 'network') {
      setNetworkStore(newStore as string[])
      setSessionStore(updateSessionIfDeleteNet([selectedToDelete], sessionStore))
      if (main === 'networkPreview' && preview === selectedToDelete) {
        setPreview('')
        setMain('blank')
      }
    }
    else if (clearType === 'data') {
      setFileNameStore(newStore as string[])
      const result = updateNetworkAndSessionIfDeleteData(selectedToDelete, networkStore, sessionStore)
      setNetworkStore(result.networkStore)
      setSessionStore(result.sessionStore)
      if ((main === 'dataPreview' && preview === selectedToDelete) || (main === 'networkPreview' && isDataInNetwork(selectedNetwork, preview))) {
        setPreview('')
        setMain('blank')
      }
    }
    setOpen(false)
  }

  const toCopy = (type: OperationType, name: string) => {
    const store = type === 'network' ? networkStore : fileNameStore
    const newStore = handleCopy(type, name, store)
    if (type === 'network')
      setNetworkStore(newStore as string[])
    else if (type === 'data')
      setFileNameStore(newStore as string[])
  }

  const toRename = (type: OperationType, oldName: string, newName: string) => {
    const store = type === 'network' ? networkStore : fileNameStore
    const result = handleRename(type, oldName, newName, store)
    if (type === 'network') {
      if (result.status) {
        setNetworkStore(result.newStore as string[])
        setSessionStore(updateSessionIfRenameNet(oldName, newName, sessionStore))
        if (main === 'networkPreview' && preview === oldName) {
          setPreview(newName)
        }
      }
    }
    else if (type === 'data') {
      if (result.status) {
        setFileNameStore(result.newStore as string[])
        updateNetworkIfRenameData(oldName, newName, networkStore)
        if (main === 'dataPreview' && preview === oldName) {
          setPreview(newName)
        }
      }
    }
    return result.status
  }

  // show data or network preview
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

  const showVisSelector = (name: string) => {
    setMain('visSelector')
    setSelectedNetwork(name)
    setPreview('')
  }

  // render main component
  const renderComp = (content: string) => {
    switch (content) {
      // case 'data': 
      //   return <Data />
      case 'dataPreview': 
        const fileName = preview
        return <DataPreview 
          selectedData={fileName} 
          setPreview={setPreview}
          setMain={setMain}
        />
      case 'network': // config network
        return <Network
          moveToNewSession={setMain}
          setSelectedNetwork={setSelectedNetwork}
          setNetSource={setNetSource}
        />
      case 'networkPreview': 
        return <NetworkPreview
          selectedNetwork={preview}
          setPreview={setPreview}
          setMain={setMain}
          setSelectedNetwork={setSelectedNetwork}
        />
      case 'visSelector':
        return <VisSelector 
          network={selectedNetwork}
        />
      case 'sessions':
        return <Sessions 
          moveToNewSession={setMain}
        />
      case 'newSession': 
        return <NewSession
          key={triggerReMount}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          moveToNetwork={setMain}
          netSource={netSource}
        />
      default:
        return <div>{main}</div>
    }
  }

  return (
    <WizardContext.Provider value={wizardContext}>
      <div className={classes.root}>
        <div className={classes.list}>
          <div className={classes.header}>
            <a href="./" style={{ marginBottom: "20px", textAlign: 'center', marginTop: 15}}>
              <img src="./logos/logo-a.png" style={{ width: 230}} />
            </a>
            <Button  
              type='primary' 
              style={{ marginBottom: 10, marginRight: 10, fontWeight: 700 }}
              onClick={()=>{
                setMain('sessions')
                // initialize
                setPreview('')
                setSelectedNetwork('')
                setNetSource(undefined)
              }}
            >
            My Visualizations
            </Button>
            <Button
              type='primary'
              style={{ marginBottom: 10, marginRight: 10, fontWeight: 700 }}
              onClick={() => {
                setTriggerReMount(Math.random())
                setMain('newSession')
                // initialize
                setPreview('')
                setSelectedNetwork('')
                setNetSource(undefined)
              }}
            >
              New Network
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
                  onClick={() => handleSelectToDelete('network', HANDLEALL)}
                />
              </Tooltip>
              
            </div>
            {networkStore.sort().map((network: string) => {
              const selectedPreview = main === 'visSelector' ? `networkPreview-${selectedNetwork}` : `${main}-${preview}`
              return (<Record 
                key={network}
                data={network}
                type="network"
                handleSelectToDelete={handleSelectToDelete}
                showPreview={showPreview}
                selectedPreview={selectedPreview}
                toCopy={toCopy}
                toRename={toRename}
                showVisSelector={showVisSelector}
              />)}
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
                    setSelectedToDelete(HANDLEALL)
                  }}
                />
              </Tooltip>
            </div>
            {fileNameStore.sort().map((fileName: string) => (
              <Record
                key={fileName}
                data={fileName}
                type="data"
                handleSelectToDelete={handleSelectToDelete}
                showPreview={showPreview}
                selectedPreview={`${main}-${preview}`}
                toCopy={toCopy}
                toRename={toRename}
                showVisSelector={showVisSelector}
              />
            ))}
          </div> 
          
          {/* modal for delete data/network */}
          <Modal
            title={`Delete ${clearType}`}
            open={open}
            onCancel={() => setOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setOpen(false)}>
                Cancel
              </Button>,
              <Button 
                key="ok" 
                type="primary" 
                onClick={() => toDelete()}
              >
                OK
              </Button>
            ]}
          >
            <p>Are you sure you want to delete {selectedToDelete === HANDLEALL ? `all the ${clearType}`: selectedToDelete} ? All the related {clearType === 'network' ? `visualizations` : `networks and visualizations`} will be delelted accordingly. </p>
          </Modal>
          
        </div>

        {/* the right side */}
        <div className={classes.main}>
          {renderComp(main)}
        </div>
      </div>
    </WizardContext.Provider>
  )
}


export default Wizard