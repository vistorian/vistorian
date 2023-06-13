import { NetworkConfig } from "../../../typings"

export const genSpecFromLinkTable = (networkName: string) => {
  const config = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + networkName) as string) as NetworkConfig
  const linkFileName = config.linkTableConfig?.file
  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:${timeFormat}` }} : null

  const linkTableImportSpec = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "csv", // TODO: add more types
      ...parse
    }
  }

  const dataSpec = [linkTableImportSpec]
  const networkSpec = {
    name: 'network',
    links: "links",
    nodes: "nodes",
    directed: config.linkTableConfig?.directed
  }

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}