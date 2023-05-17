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

interface StepFormDataType {
  step1Name: Step1NameDataType | null
  step2Format: Step2FormatDataType | null
  step3Link: Step3LinkDataType | null
  step4Specify: Step4SpecifyDataType | null
  step5LocationSpec: Step5LocationSpecDataType | null
  step6NodeSpec: Step6NodeSpecDataType | null
}

interface Step1NameDataType {
  name: string
}

type NetworkFormat = "tabular" | "other"

interface Step2FormatDataType {
  format: NetworkFormat
}

type NetworkLink = "rowPerLink" | "rowPerNode"

interface Step3LinkDataType {
  link: NetworkLink
}

interface RelationType {
  [key: string]: string
}

interface Step4SpecifyDataType {
  directed: boolean
  file: any
  hasHeaderRow: boolean
  sourceNodeLabel?: string
  targetNodeLabel?: string
  linkId?: string
  locationOfSourceNode?: string
  locationOfTargetNode?: string
  linkWeight?: string
  linkType?: string
  whetherLinkDirected?: string
  withTime?: boolean
  time?: string
  timeFormat?: string
}

interface Step5LocationSpecDataType {
  locationSpecFile?: any
  hasLocationSpecFile: boolean
}

interface Step6NodeSpecDataType {
  nodeSpecFile?: any
  hasNodeSpecFile: boolean
  nodeType: string
}

export {
  DataFile,
  EditorCtx,
  StepFormDataType,
  Step1NameDataType,
  NetworkFormat,
  Step2FormatDataType,
  NetworkLink,
  Step3LinkDataType,
  RelationType,
  Step4SpecifyDataType,
  Step5LocationSpecDataType,
  Step6NodeSpecDataType
}