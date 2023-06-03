type DataFile = {
  name: string,
  hasHeader: boolean,
}

type EditorCtx = {
  fileNameStore: DataFile[]
  setFileNameStore: (fileNameStore: DataFile[]) => void;
  networkStore: string[]
  setNetworkStore: (fileNameStore: string[]) => void;
}

type Session = {
  name: string,
  network: string,
  vis: string
}

// Vis template
type Template = {
  key: string,
  label: string,
  image: string,
  template: string,
}

type OperationType = "data" | "network" | null

type StepType = "name" | "format" | "linkType" | "linkTableConfig" | "nodeTableConfig" | "locationTableConfig" |  "extraNodeConfig" 
type StepData = NetworkName | NetworkFormat | LinkType | LinkTableConfig | NodeTableConfig | LocationTableConfig | ExtraNodeConfig | null

interface NetworkConfig {
  name: NetworkName | null
  format: NetworkFormat | null
  linkType: LinkType | null
  linkTableConfig: LinkTableConfig | null
  nodeTableConfig: NodeTableConfig | null
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

type LinkTypeOpt = "rowPerLink" | "rowPerNode"

interface LinkType {
  linkType: LinkTypeOpt
}

interface LinkTableConfig {
  directed: boolean
  file: any
  hasHeaderRow: boolean
  sourceNodeLabel: string
  targetNodeLabel: string
  linkId?: string
  locationOfSourceNode?: string
  locationOfTargetNode?: string
  linkWeight?: string
  linkType?: string
  whetherLinkDirected?: string
  withTime: boolean
  time?: string
  timeFormat?: string
}

interface LocationTableConfig {
  hasLocationFile: boolean
  file?: any
  hasHeaderRow?: boolean
  place?: string
  lat?: string
  lon?: string
}

interface ExtraNodeConfig {
  hasExtraNode: boolean
  file?: any
  hasHeaderRow?: boolean
  nodeID?: string
  nodeType?: string
}

interface RelationType {
  column: string,
  linkName: string
}

interface NodeTableConfig {
  file: any
  node: string,
  relations: RelationType[]
}

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

export {
  DataFile,
  EditorCtx,
  Session,
  OperationType,
  Template,
  StepType,
  StepData,
  NetworkConfig,
  NetworkName,
  NetworkFormatOpt,
  NetworkFormat,
  LinkTypeOpt,
  LinkType, 
  LinkTableConfig,
  RelationType,
  LocationTableConfig,
  NodeTableConfig,
  ExtraNodeConfig,
  IStepProps,
  SelectOptionType
}