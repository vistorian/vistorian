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


type StepType = "name" | "format" | "linkType" | "linkTableConfig" | "nodeTableConfig" | "locationTableConfig" |  "extraNodeConfig" | "end"
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
  locationSpecFile?: any
  hasLocationSpecFile: boolean
}

interface ExtraNodeConfig {
  hasExtraNode: boolean
}

interface RelationType {
  [key: string]: string
}

interface NodeTableConfig {
  nodeSpecFile?: any
  hasNodeSpecFile: boolean
  nodeType: string
}

interface IStepProps {
  data: NetworkConfig;
  onSuccess: (data: StepData, step: StepType) => void;
  onPrevious: (step: StepType) => void;
  MyButton: React.FunctionComponent<ButtonProps>;
}

export {
  DataFile,
  EditorCtx,
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
  IStepProps
}