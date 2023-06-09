import { createContext } from 'react'
import { WizardCtx, DataFile, Session } from '../../../typings'

export let WizardContext = createContext<WizardCtx>({
  fileNameStore: [] as DataFile[],
  setFileNameStore: () => {},
  networkStore: [] as string[],
  setNetworkStore: () => {},
  sessionStore: [] as Session[],
  setSessionStore: () => {}
})   