import { NetworkPattern } from "../src/components/xplainer/motifs/motif"

type Session = {
  id: number,
  network: string,
  vis: string
  created: string,
}

type Editor= {
  id: number,
  type: string,
  created: string,
  textId:string,
  textContent: object,
  isAddedVis:boolean,
  visId:string,
  networkEd: string,
  visTypeList: string[],
  caption:string,
}

type Story= {
  id: string,
  title:string,
  author: string,
  created: string,
  content:object
}

type WizardCtx = {
  fileNameStore: string[]
  setFileNameStore: (fileNameStore: string[]) => void;
  networkStore: string[]
  setNetworkStore: (networkStore: string[]) => void;
  sessionStore: Session[]
  setSessionStore: (sessionStore: Session[]) => void
}

type BlogCtx = {
  fileNameStore: string[]
  setFileNameStore: (fileNameStore: string[]) => void;
  networkStore: string[]
  setNetworkStore: (networkStore: string[]) => void;
  sessionStore: Session[]
  setSessionStore: (sessionStore: Session[]) => void;
  editorStore: Editor[]
  setEditorStore: (EditorStore: Editor[]) => void;
  storyStore: Story[]
  setStory: (storyStore: Story[]) => void;
}

type StoryCtx = {
  fileNameStore: string[]
  setFileNameStore: (fileNameStore: string[]) => void;
  networkStore: string[]
  setNetworkStore: (networkStore: string[]) => void;
  sessionStore: Session[]
  setSessionStore: (sessionStore: Session[]) => void;
  editorStore: Editor[]
  setEditorStore: (EditorStore: Editor[]) => void;
  storyStore: Story[]
  setStory: (storyStore: Story[]) => void;
}

// Vis template
type Template = {
  key: string,
  label: string,
  image: string,
  template: string,
  manual: string, 
  description: string,
  error: string
}

type OperationType = "data" | "network" | null

// type StepType = "name" | "format" | "linkType" | "linkTableConfig" | "nodeTableConfig" | "locationTableConfig" |  "extraNodeConfig" 
// type StepData = NetworkName | NetworkFormat | LinkType | LinkTableConfig | NodeTableConfig | LocationTableConfig | ExtraNodeConfig | null

type StepType = "name" | "format" | "linkTableConfig" | "locationTableConfig" | "extraNodeConfig" 
type StepData = NetworkName | NetworkFormat | LinkTableConfig | LocationTableConfig | ExtraNodeConfig | null

interface NetworkConfig {
  name: NetworkName | null
  format: NetworkFormat | null
  // linkType: LinkType | null
  linkTableConfig: LinkTableConfig | null
  // nodeTableConfig: NodeTableConfig | null
  locationTableConfig: LocationTableConfig | null
  extraNodeConfig: ExtraNodeConfig | null
}

interface NetworkName {
  name: string
}

type NetworkFormatOpt = "tabular" | "other"

interface NetworkFormat {
  format: NetworkFormatOpt
}


interface LinkTableConfig {
  directed: boolean
  file: string
  dragger?: any
  hasHeaderRow: boolean
  sourceNodeLabel: string
  targetNodeLabel: string
  linkId?: string
  locationOfSourceNode?: string
  locationOfTargetNode?: string
  linkWeight?: string
  linkType?: string
  withTime: boolean
  time?: string
  timeFormat?: string
}

interface LocationTableConfig {
  hasLocationFile: boolean
  file?: string
  dragger?: any
  hasHeaderRow?: boolean
  place?: string
  lat?: string
  lon?: string
}

interface ExtraNodeConfig {
  hasExtraNode: boolean
  file?: string
  dragger?: any
  hasHeaderRow?: boolean
  nodeID?: string
  nodeLabel?: string
  nodeTypes?: string[]
  numericalNodeAttributes?: string[]
  nodeLocation?: string
}

// interface RelationType {
//   column: string,
//   linkName: string
// }

// interface NodeTableConfig {
//   file: string
//   node: string,
//   relations: RelationType[]
// }

interface IStepProps {
  data: NetworkConfig;
  onSuccess: (data: StepData, step: StepType) => void;
  onPrevious: (step: StepType) => void;
  MyButton: React.FunctionComponent<ButtonProps>;
}

interface SelectOptionType {
  value: string,
  label: string
}

type AllMotifs = { [name: string]: NetworkPattern[] }


export {
  // DataFile,
  WizardCtx,
  Session,
  OperationType,
  Template,
  StepType,
  StepData,
  NetworkConfig,
  NetworkName,
  NetworkFormatOpt,
  NetworkFormat,
  LinkTableConfig,
  LocationTableConfig,
  ExtraNodeConfig,
  IStepProps,
  SelectOptionType,
  AllMotifs,
  BlogCtx,
  Editor,
  StoryCtx,
  Story
}