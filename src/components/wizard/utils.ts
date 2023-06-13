import { message } from "antd"
import { DataFile, OperationType, Session } from "../../../typings"
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
      window.localStorage.removeItem("NETWORK_DEFINITION_" + name)
      newStore = networkStore.filter((ns) => ns !== name)
      message.success('The selected network has been successfully deleted!')
    }
    else if (name === HANDLEALL) {
      networkStore.map(ns => window.localStorage.removeItem("NETWORK_DEFINITION_" + ns))
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
    const data = window.localStorage.getItem("NETWORK_DEFINITION_" + name)
    const newName = `${name}_copy`
    if (data) {
      window.localStorage.setItem("NETWORK_DEFINITION_" + newName, data)
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
      const result = window.localStorage.getItem("NETWORK_DEFINITION_" + oldName)
      if (idx !== -1 && result) {
        networkStore[idx] = newName
        newStore = [...networkStore]
        window.localStorage.removeItem("NETWORK_DEFINITION_" + oldName)
        window.localStorage.setItem("NETWORK_DEFINITION_" + newName, result)
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
// name: network name
export const updateSessionIfDeleteNet = (name: string, sessionStore: Session[]) => {
  let newStore: Session[] = [...sessionStore]
   // delete all networks, therefore deleting all sessions
  if (name === HANDLEALL) {
    sessionStore.forEach(ss => window.localStorage.removeItem("SAVED_SESSION_"+ss.id))
    newStore = []
  }
  else { // delete selected networks
    newStore = sessionStore.filter(ss => {
      if (ss.network === name) {
        window.localStorage.removeItem("SAVED_SESSION_" + ss.id)
        return false
      }
    })
  }
  return newStore
}

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
export const updateNetworkIfDeleteData = (name: string, networkStore: string[]) => {
  let newStore: string[] = [...networkStore]
  if (name === HANDLEALL) {
    networkStore.forEach(network => window.localStorage.removeItem("NETWORK_DEFINITION_" + network))
    newStore = []
  }
  else { // delete selected networks
    newStore = networkStore.filter(network => {
      const data = JSON.parse(window.localStorage.getItem("NETWORK_DEFINITION_" + network) as string)
      if ((data.linkTableConfig && data.linkTableConfig.file === name) || (data.nodeTableConfig && data.nodeTableConfig.file === name) || (data.locationTableConfig && data.locationTableConfig.file === name) || (data.extraNodeConfig && data.extraNodeConfig.file === name)) {
        window.localStorage.removeItem("NETWORK_DEFINITION_" + network)
        return false
      }
    })
  }
  return newStore
}

export const updateNetworkIfRenameData = (oldName: string, newName: string, networkStore: string[]) => {
  let newStore: string[] = [...networkStore]
  networkStore.forEach((network, index) => {
    const data = JSON.parse(window.localStorage.getItem("NETWORK_DEFINITION_" + network) as string)
    const configTypes = ['linkTableConfig', 'nodeTableConfig', 'locationTableConfig', 'extraNodeConfig']
    configTypes.forEach((cfg: string) => {
      if (data[cfg] && data[cfg]['file'] === oldName) {
        data[cfg]['file'] = newName
        window.localStorage.setItem("NETWORK_DEFINITION_" + network, JSON.stringify(data))
      }
    })
  })
  return newStore
}