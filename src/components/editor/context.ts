import { createContext } from 'react'
import { EditorCtx } from '../../../typings'

export let EditorContext = createContext<EditorCtx>({
  fileNameStore: [] as string[],
  setFileNameStore: () => {},
  networkStore: [] as string[],
  setNetworkStore: () => {},
})   