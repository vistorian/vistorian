import { createContext } from 'react'
import { StoryCtx, Session, Editor, Story} from '../../../typings'

export const StoryContext = createContext<StoryCtx>({
    fileNameStore: [] as string[],
    setFileNameStore: () => {},
    networkStore: [] as string[],
    setNetworkStore: () => {},
    sessionStore: [] as Session[],
    setSessionStore: () => {},
    editorStore: [] as Editor[],
    setEditorStore:()=> {},
    storyStore: [] as Story[],
    setStory:()=> {},
})