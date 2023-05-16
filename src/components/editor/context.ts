import { createContext } from 'react'
import { EditorCtx, DataFile } from '../../../typings'

export let EditorContext = createContext<EditorCtx>({
  fileNameStore: [] as DataFile[],
  setFileNameStore: () => {},
  networkStore: [] as string[],
  setNetworkStore: () => {},
})   