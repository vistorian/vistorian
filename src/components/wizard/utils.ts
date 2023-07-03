import { message } from "antd"
import { DataFile, NetworkConfig, OperationType, Session } from "../../../typings"
import { HANDLEALL } from '../../../typings/constant' 
import { findIndex, filter } from "lodash-es"

// ========== FileNameStore or NetworkStore ============
// delete data or network
export const handleDelete = (type: OperationType, name: string, store: Array<string | DataFile>) => {
  let newStore = [...store]
  if (type === 'data') {
    let fileNameStore = store as DataFile[]
    if (name !== HANDLEALL && findIndex(fileNameStore, (fn: DataFile) => fn.name === name) !== -1) {
      window.localStorage.removeItem("UPLOADED_FILE_" + name)
      newStore = filter(fileNameStore, (fn) => fn.name !== name)
      message.success('The selected data has been successfully deleted!')
    }
    else if (name === HANDLEALL) {
      fileNameStore.map((fn: DataFile) => window.localStorage.removeItem("UPLOADED_FILE_" + fn.name))
      newStore = [] as DataFile[]
      message.success('All data have been successfully deleted!')
    }
  }
  else if (type === 'network') {
    let networkStore = store as string[]
    if (name !== HANDLEALL && networkStore.indexOf(name) !== -1) {
      window.localStorage.removeItem("NETWORK_WIZARD_" + name)
      newStore = networkStore.filter((ns) => ns !== name)
      message.success('The selected network has been successfully deleted!')
    }
    else if (name === HANDLEALL) {
      networkStore.map(ns => window.localStorage.removeItem("NETWORK_WIZARD_" + ns))
      newStore = [] as string[]
      message.success('All networks have been successfully deleted!')
    }
  }
  return newStore
}

// copy data or network
export const handleCopy = (type: OperationType, name: string, store: Array<string | DataFile>) => {
  let newStore = [...store]
  if (type === 'data') {
    let fileNameStore = store as DataFile[]
    const data = window.localStorage.getItem("UPLOADED_FILE_" + name)
    const idx = findIndex(fileNameStore, (fn) => fn.name === name)
    if (idx > -1 && data) {
      const newData = { ...fileNameStore[idx] }
      // get only the name without file postfix
      const reg = /\.(.*)$/
      const split = name.split('').reverse().join('').split(reg)
      newData.name = `${split[1].split('').reverse().join('')}_copy.${split[0].split('').reverse().join('')}`
      window.localStorage.setItem("UPLOADED_FILE_" + newData.name, data)
      newStore.unshift(newData)
      message.success('The selected data has been successfully copied! Related networks and visualizations are updated!')
    }
    else
      message.error('No such data files in the cache!')
  }
  else if (type === 'network') {
    let networkStore = store as string[]
    const data = window.localStorage.getItem("NETWORK_WIZARD_" + name)
    const newName = `${name}_copy`
    if (data) {
      window.localStorage.setItem("NETWORK_WIZARD_" + newName, data)
      newStore.unshift(newName)
      message.success('The selected network has been successfully copied! Related visualizations are updated!')
    }
    else
      message.error('No such networks in the cache!')
  }
  return newStore
}

// rename data or network
export const handleRename = (type: OperationType, oldName: string, newName: string, store: Array<string | DataFile>) => {
  let newStore = [...store]
  let status: boolean = false

  if (type === 'data') {
    let fileNameStore = store as DataFile[]
    // TODO: examine the postfix to be .csv/.tsv/...
    if (newName.length < 1) {
      message.error("The data must have a name!")
      status = false
    }
    else if (findIndex(fileNameStore, (fn: DataFile) => fn.name === newName) !== -1) {
      message.error("The new data name has existed!")
      status = false
    }
    else {
      const idx = findIndex(fileNameStore, (fn: DataFile) => fn.name === oldName)
      const result = window.localStorage.getItem("UPLOADED_FILE_" + oldName)
      if (idx !== -1 && result) {
        fileNameStore[idx].name = newName
        newStore = [...fileNameStore]
        window.localStorage.removeItem("UPLOADED_FILE_" + oldName)
        window.localStorage.setItem("UPLOADED_FILE_" + newName, result)
        message.success('The selected data has been successfully renamed! Related networks and visualizations are updated!')
        status = true
      }
      else {
        message.error('No such data in the cache!')
        status = false
      }
    }
  }
  else if (type === 'network') {
    let networkStore = store as string[]
    if (newName.length < 1) {
      message.error("The network must have a name!")
      status = false
    }
    else if (networkStore.indexOf(newName) !== -1) {
      message.error("The new network name has existed!")
      status = false
    }
    else { 
      const idx = networkStore.indexOf(oldName)
      const result = window.localStorage.getItem("NETWORK_WIZARD_" + oldName)
      if (idx !== -1 && result) {
        networkStore[idx] = newName
        newStore = [...networkStore]
        window.localStorage.removeItem("NETWORK_WIZARD_" + oldName)
        window.localStorage.setItem("NETWORK_WIZARD_" + newName, result)
        message.success('The selected network has been successfully renamed! Related networks and visualizations are updated!')
        status = true
      }
      else {
        message.error('No such network in the cache!')
        status = false
      }
    }
  }
  return {
    status: status,
    newStore: newStore
  }
}


// ====== update session when network updates (i.e., rename, delete) ===============
/**
 * @description update corresponding sessions when deteling networks
 * @param {string[]} names network names
 * @param {Session[]} sessionStore old session store
 * @return {*} new session store
 */
export const updateSessionIfDeleteNet = (names: string[], sessionStore: Session[]) => {
  let newStore: Session[] = [...sessionStore]
   // delete all networks, therefore deleting all sessions
  if (names[0] === HANDLEALL) {
    sessionStore.forEach(ss => window.localStorage.removeItem("SAVED_SESSION_"+ss.id))
    newStore = []
  }
  else { // delete the selected network
    newStore = sessionStore.filter(ss => {
      if (names.includes(ss.network)) {
        window.localStorage.removeItem("SAVED_SESSION_" + ss.id)
        return false
      }
      return true
    })
  }
  return newStore
}

/**
 * @description update corresponding sessions when renaming a network
 * @param {string} oldNames old network name
 * @param {string} newNames new network name
 * @param {Session[]} sessionStore old session store
 * @return {*} new session store
 */
export const updateSessionIfRenameNet = (oldName: string, newName: string, sessionStore: Session[]) => {
  let newStore: Session[] = [...sessionStore]
  sessionStore.forEach((ss, index)=>{
    if (ss.network === oldName) {
      newStore[index].network = newName //update newtork name
      window.localStorage.setItem("SAVED_SESSION_"+ss.id, JSON.stringify(newStore[index]))
    }
  })
  return newStore
}


// ====== update network and sessions when data updates (i.e., rename, delete) ========
/**
 * @description update corresponding sessions when deteling a network
 * @param {string} dataName data name
 * @param {string} netName network name
 * @return {boolean} true: the selected data in the selected network
 */
export const isDataInNetwork = (dataName: string, netName: string) => {
  const config = JSON.parse(window.localStorage.getItem('NETWORK_WIZARD_' + netName) as string) as NetworkConfig
  if (config.linkTableConfig?.file === dataName || config.extraNodeConfig?.file === dataName) {
    return true
  }
  return false
}

/**
 * @description update corresponding networks and sessions when deteling data
 * @param {string} name data name
 * @param {string[]} networkStore old network store
 * @param {Session[]} sessionStore old session store
 * @return {Object} new network store & session store
 */
export const updateNetworkAndSessionIfDeleteData = (name: string, networkStore: string[], sessionStore: Session[]) => {
  let newNetStore: string[] = [...networkStore]
  let newSessionStore: Session[] = [...sessionStore]
  if (name === HANDLEALL) {
    networkStore.forEach(network => window.localStorage.removeItem("NETWORK_WIZARD_" + network))
    sessionStore.forEach(ss => window.localStorage.removeItem("SAVED_SESSION_" + ss.id))
    newNetStore = []
    newSessionStore = []
  }
  else { // delete selected networks and sessions
    const deleted: string[] = []
    newNetStore = networkStore.filter(network => {
      if (isDataInNetwork(name, network)) {
        window.localStorage.removeItem("NETWORK_WIZARD_" + network)
        deleted.push(network)
        return false
      }
      return true
    })
    newSessionStore = updateSessionIfDeleteNet(deleted, sessionStore)
  }
  return {
    networkStore: newNetStore,
    sessionStore: newSessionStore
  }
}

/**
 * @description update corresponding networks in storage when renaming a data
 * @param {string} oldName old data name
 * @param {string} newName new data name
 * @param {string[]} store network store
 * @return {void} 
 */
export const updateNetworkIfRenameData = (oldName: string, newName: string, store: string[]) => {
  store.forEach(network => {
    const config = JSON.parse(window.localStorage.getItem('NETWORK_WIZARD_' + network) as string) as NetworkConfig
    if (config.linkTableConfig?.file === oldName) {
      config.linkTableConfig.file = newName
    }
    if (config.extraNodeConfig?.file === oldName) {
      config.extraNodeConfig.file = newName
    }
    window.localStorage.setItem('NETWORK_WIZARD_' + network, JSON.stringify(config))
  })
}