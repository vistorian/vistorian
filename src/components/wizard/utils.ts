import { message } from "antd"
import { DataFile, OperationType, Session } from "../../../typings"
import { findIndex, filter } from "lodash-es"

// ========== FileNameStore or NetworkStore ============
// delete data or network
export const handleDelete = (type: OperationType, name: string, store: Array<string | DataFile>) => {
  let newStore = [...store]
  if (type === 'data') {
    let fileNameStore = store as DataFile[]
    if (name !== 'all' && findIndex(fileNameStore, (fn: DataFile) => fn.name === name) !== -1) {
      window.localStorage.removeItem("UPLOADED_FILE_" + name)
      newStore = filter(fileNameStore, (fn) => fn.name !== name)
      message.success('The selected data has been successfully deleted!')
    }
    else if (name === 'all') {
      fileNameStore.map((fn: DataFile) => window.localStorage.removeItem("UPLOADED_FILE_" + fn.name))
      newStore = [] as DataFile[]
      message.success('All data have been successfully deleted!')
    }
  }
  else if (type === 'network') {
    let networkStore = store as string[]
    if (name !== 'all' && networkStore.indexOf(name) !== -1) {
      window.localStorage.removeItem("NETWORK_DEFINITION_" + name)
      newStore = networkStore.filter((ns) => ns !== name)
      message.success('The selected network has been successfully deleted!')
    }
    else if (name === 'all') {
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
      message.success('The selected data has been successfully copied!')
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
      message.success('The selected network has been successfully copied!')
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
        message.success('The selected data has been successfully renamed!')
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
        message.success('The selected network has been successfully renamed!')
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

// ====== handle session updates when network or data updates (i.e., rename, delte) ===============
// name: network/data name
// export const updateSessionIfDelete = (type: OperationType, name: string, sessionStore: Array<Session>) => {
//   if (type === 'network') {
//     sessionStore.filter(session=> session.network === name)
//   }
// }