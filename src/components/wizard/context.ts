import { createContext } from 'react'
import { WizardCtx, Session } from '../../../typings'

export let WizardContext = createContext<WizardCtx>({
  fileNameStore: [] as string[],
  setFileNameStore: () => {},
  networkStore: [] as string[],
  setNetworkStore: () => {},
  sessionStore: [] as Session[],
  setSessionStore: () => {}
})   