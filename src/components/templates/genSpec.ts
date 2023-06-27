import { NetworkConfig } from "../../../typings"

export const genSpecFromLinkTable = (config: NetworkConfig, visType: string) => {
  const linkFileName = config.linkTableConfig?.file

  const sourceLabel = config.linkTableConfig?.sourceNodeLabel
  const targetLabel = config.linkTableConfig?.targetNodeLabel

  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:'${timeFormat}'`}} : null
  const linkTableImportSpec: any = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "csv", // TODO: add more types
      ...parse
    }
  }

  if (visType === 'timearcs') {
    linkTableImportSpec.transform = [
      {
        "type": "calculate",
        "as": "source",
        "calculate": `datum.${sourceLabel} + ' (' + datum.${timeColumn} + ')'`
      },
      {
        "type": "calculate",
        "as": "target",
        "calculate": `datum.${targetLabel} + ' (' + datum.${timeColumn} + ')'`
      }
    ]
  }

  let dataSpec = [linkTableImportSpec]

  const networkSpec = {
    name: "network",
    "parts": [
      {
        "data": "links",
        "yieldsNodes" : [
          {
            "id_field": "source",
            "type": "person",
            "data": [
              { "field": sourceLabel, "as": "name" },
              { "field": timeColumn, "as": "date" }
            ]
          },
          {
            "id_field": "target",
            "type": "person",
            "data": [
              { "field": targetLabel, "as": "name" },
              { "field": timeColumn, "as": "date" }
            ]
          }
        ],
        "yieldsLinks": [
          {
            "source_id": { "field": sourceLabel },
            "source_node_type": "person",
            "source_id_field": "id",

            "target_id": { "field": targetLabel },
            "target_node_type": "person",
            "target_id_field": "id",

            "data": ["*"]
          }
        ]
      }
    ],
    "transform": [
      { "type": "metric", "metric": "degree" }
    ] as any[]
  }

  // TODO: deal with geo config, linkID
  if (config.linkTableConfig?.linkType) 
    networkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum.data.${config.linkTableConfig?.linkType}`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    networkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum.data.${config.linkTableConfig?.linkWeight}`, "for": "links" })

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}


// TODO: map to visType
export const genSpecFromLinkAndNodeTable = (config: NetworkConfig, visType: string) => {
  const linkFileName = config.linkTableConfig?.file

  const sourceLabel = config.linkTableConfig?.sourceNodeLabel
  const targetLabel = config.linkTableConfig?.targetNodeLabel

  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:'${timeFormat}'` } } : null

  const linkTableImportSpec = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "csv", // TODO: add more types
      ...parse
    }
  }

  let dataSpec = [linkTableImportSpec]
  if (config.extraNodeConfig?.hasExtraNode) {
    dataSpec = [
      linkTableImportSpec,
      {
        "name": "nodes",
        "localStorage": "UPLOADED_FILE_" + config.extraNodeConfig.file,
        "format": { type: "csv" }
      }
    ]
  }

  // is "id" correct default for case when only link-table used?
  const idField = config.extraNodeConfig?.hasExtraNode ? config.extraNodeConfig.nodeID : "id" 


  const networkSpec = {
    name: "network",
    links: "links",
    nodes: config.extraNodeConfig?.hasExtraNode ? "nodes" : undefined,
    directed: config.linkTableConfig?.directed,

    source_node: [sourceLabel, idField],
    target_node: [targetLabel, idField],

    transform: [
      { "type": "metric", "metric": "degree" },
    ] as any[],
  }

  // TODO: deal with geo config
  if (config.linkTableConfig?.linkType)
    networkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum.data.${config.linkTableConfig?.linkType}`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    networkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum.data.${config.linkTableConfig?.linkWeight}`, "for": "links" })

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}