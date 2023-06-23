import { NetworkConfig } from "../../../typings"

export const genSpecFromLinkTable = (config: NetworkConfig) => {
  const linkFileName = config.linkTableConfig?.file
  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:'${timeFormat}'`}} : null

  const linkTableImportSpec = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "csv", // TODO: add more types
      ...parse
    }
  }

  let dataSpec = [linkTableImportSpec]
  // if (config.extraNodeConfig?.hasExtraNode) {
  //   dataSpec = [
  //     linkTableImportSpec,
  //     {
  //       "name": "nodes",
  //       "localStorage": "UPLOADED_FILE_" + config.extraNodeConfig.file,
  //       "format": { type: "csv" }
  //     }
  //   ]
  // }

  // is "id" correct default for case when only link-table used?
  // const idField = config.extraNodeConfig?.hasExtraNode ? config.extraNodeConfig.nodeID : "id" 

  const networkSpec = {
    name: "network",
    "parts": [
      {
        "data": "links",
        "yieldsLinks": [
          {
            "source_id": { "field": config.linkTableConfig?.sourceNodeLabel },
            "source_node_type": "person",
            "source_id_field": "id",

            "target_id": { "field": config.linkTableConfig?.targetNodeLabel },
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

  // const networkSpec = {
  //   name: "network",
  //   links: "links",
  //   nodes: config.extraNodeConfig?.hasExtraNode ? "nodes" : undefined,
  //   directed: config.linkTableConfig?.directed,

  //   source_node: [config.linkTableConfig?.sourceNodeLabel, idField],
  //   target_node: [config.linkTableConfig?.targetNodeLabel, idField],

  //   transform: [
  //     { "type": "metric", "metric": "degree" },
  //   ] as any[],
  // }
  
  // // TODO: deal with geo config
  if (config.linkTableConfig?.linkType) 
    networkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum[${config.linkTableConfig?.linkType}]`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    networkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum[${config.linkTableConfig?.linkWeight}]`, "for": "links" })

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}

export const genSpecFromLinkAndNodeTable = (config: NetworkConfig) => {
  const linkFileName = config.linkTableConfig?.file
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

    source_node: [config.linkTableConfig?.sourceNodeLabel, idField],
    target_node: [config.linkTableConfig?.targetNodeLabel, idField],

    transform: [
      { "type": "metric", "metric": "degree" },
    ] as any[],
  }

  // // TODO: deal with geo config
  if (config.linkTableConfig?.linkType)
    networkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum[${config.linkTableConfig?.linkType}]`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    networkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum[${config.linkTableConfig?.linkWeight}]`, "for": "links" })

  return {
    data: dataSpec,
    network: [networkSpec]
  }
}