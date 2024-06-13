import { NetworkConfig } from "../../../typings"

export const genSpecFromLinkTable = (config: NetworkConfig, visType: string) => {
  // console.log('config', config)

  const linkFileName = config.linkTableConfig?.file

  const sourceLabel = config.linkTableConfig?.sourceNodeLabel
  const targetLabel = config.linkTableConfig?.targetNodeLabel

  const timeColumn = config.linkTableConfig?.time
  const timeFormat = config.linkTableConfig?.timeFormat

  const defaultNodeType = "_default_node_type"

  const parse = timeColumn ? { 'parse': { [timeColumn]: `date:'${timeFormat}'` } } : null

  // =========== FOR DATA SPEC =========== 
  const linkTableImportSpec = {
    name: "links",
    localStorage: "UPLOADED_FILE_" + linkFileName,
    format: {
      type: "json", // TODO: add more types
      ...parse
    },
    transform: [
      {
        "type": "calculate",
        "as": "source",
        // "calculate": `datum.${sourceLabel}`,
        "calculate": `datum['${sourceLabel}']`
      },
      {
        "type": "calculate",
        "as": "target",
        // "calculate": `datum.${targetLabel}`,
        "calculate": `datum['${targetLabel}']`
      }
    ] as any[]
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
  if (visType === 'map') {
    linkTableImportSpec.transform = [
      {
        "type": "geocode",
        "locationField": "Place1",
        "lonAs": "Lon1",
        "latAs": "Lat1"
      },
      {
        "type": "geocode",
        "locationField": "Place2",
        "lonAs": "Lon2",
        "latAs": "Lat2"
      },
      {
        "type": "calculate",
        "as": "source",
        "calculate": `datum.${sourceLabel} + ' (' + datum.Place1 + ')'`
      },
      {
        "type": "calculate",
        "as": "target",
        "calculate": `datum.${targetLabel} + ' (' + datum.Place2 + ')'`
      }
    ]
  }
  // respond to global time slider
  if (config.linkTableConfig?.withTime) {
    linkTableImportSpec.transform.push({
      "type": "calculate",
      "as": "_time",
      "calculate": `datum.${config.linkTableConfig.time}`
    })
  }
  if(visType == 'map'){
    linkTableImportSpec.transform.push(
      {
        "type": "filter",
        "expr": "!!datum.Lon1 && !!datum.Lon2 && !!datum.Lat1 && !!datum.Lat2"
      }
    )
  }

  let dataSpec = [linkTableImportSpec]

  // =========== if exists the node dataset =========== 
  if (config.extraNodeConfig?.hasExtraNode) {
    let trans: any[] = []
    const calc = config.extraNodeConfig?.nodeLabel ? config.extraNodeConfig?.nodeLabel : 'id'

    trans.push({
      "type": "calculate",
      "as": `_label`,
      // "calculate": `datum.${calc}`
      "calculate": `datum['${calc}']`
    })
    config.extraNodeConfig?.nodeTypes?.forEach((type, index) => {
      if (type) {
        trans.push({
          "type": "calculate",
          "as": `type${index}`,
          // "calculate": `datum.${type}`
          "calculate": `datum['${type}']`
        })
      }
    })
    dataSpec = [
      linkTableImportSpec,
      {
        "name": "nodes",
        "localStorage": "UPLOADED_FILE_" + config.extraNodeConfig?.file,
        "format": { type: "json" },
        "transform": trans
      }
    ]
  }

  // =========== FOR NETWORK SPEC =========== 
  /**
   * @description
   * @param {string} type is this node 'source' or 'target'?
   * @return {*} 
   */
  const getNodeRawData = (type: string) => {
    const f = (type === 'source') ? sourceLabel : targetLabel
    if (visType === 'timearcs') {
      return [
        { "field": f, "as": "name" },
        { "field": timeColumn,  "as": "_time" },
        { "field": f, "as": "_label" }
      ]
    }
    else if (visType === 'map') {
      return [
        { "field": "Lon1", "as": "lon" },
        { "field": "Lat1", "as": "lat" },
        { "field": "Lon2", "as": "lon" },
        { "field": "Lat2", "as": "lat" }
      ]
    }
    else { // 'nodelink', 'matrix'
      return [
        { "field": f, "as": "name" },
        { "field": f, "as": "_label" }
      ]
    }
  }

  let networkSpec: any[] = []
  // is "id" correct default for case when only link-table used?
  const idField = config.extraNodeConfig?.hasExtraNode ? config.extraNodeConfig.nodeID : "id"

  const baseNetworkSpec: any = {
    "name": "network",
    "parts": [
      {
        "data": "links",
        "yieldsNodes": [
          {
            "id_field": "source",
            "type": defaultNodeType,
            "data": getNodeRawData('source')
          },
          {
            "id_field": "target",
            "type": defaultNodeType,
            "data": getNodeRawData('target')
          }
        ],
        "yieldsLinks": [
          {
            "source_id": { "field": "source" },
            "source_node_type": defaultNodeType,
            "source_id_field": idField,

            "target_id": { "field": "target" },
            "target_node_type": defaultNodeType,
            "target_id_field": idField,

            "addReverseLinks": visType === 'matrix' || 'arcMatrix' ? true : false,
            "data": ["*"]
          }
        ]
      }
    ] as any[],
    "transform": [
      { "type": "metric", "metric": "degree" },
      // { "type": "metric", "metric": "undirected-betweenes" }
    ] as any[],

  }

  // =========== if exists the node dataset =========== 
  if (config.extraNodeConfig?.hasExtraNode) {
    baseNetworkSpec.parts = [
      {
        "data": "nodes",
        "yieldsNodes": [
          {
            "id_field": idField,
            "type": defaultNodeType,
            "data": ['*']
          },
        ]
      },
      {
        "data": "links",
        "yieldsLinks": [
          {
            "source_id": { "field": "source" },
            "source_node_type": defaultNodeType,
            "source_id_field": idField,

            "target_id": { "field": "target" },
            "target_node_type": defaultNodeType,
            "target_id_field": idField,

            "addReverseLinks": visType === 'matrix' || 'arcMatrix' ? true : false,
            "data": ["*"]
          }
        ]
      }
    ]
  }

  networkSpec.push(baseNetworkSpec)

  if (visType == 'map') {
    networkSpec.push(
      {
        "name": "aggregatedNet",
        "source": "network",
        "transform": [
          { "type": "aggregateNodes", "fields": ["data.lat", "data.lon"] },
          { "type": "aggregateEdges" }
        ]
      });
  }

  // TODO: deal with geo config, linkID
  if (config.linkTableConfig?.linkType)
    baseNetworkSpec.transform.push({ "type": "calculate", "as": "linkType", "calculate": `datum.data.${config.linkTableConfig?.linkType}`, "for": "links" })
  if (config.linkTableConfig?.linkWeight)
    baseNetworkSpec.transform.push({ "type": "calculate", "as": "linkWeight", "calculate": `datum.data.${config.linkTableConfig?.linkWeight}`, "for": "links" })


  // =========== if vis is timearcs, generate staic network without time =========== 
  if (visType === 'timearcs') {
    const staticNetworkSpec: any = {
      "name": "staticNetwork",
      "nodes": config.extraNodeConfig?.hasExtraNode ? "nodes" : undefined,
      "links": "links",
      "directed": true,
      "source_node": [idField, sourceLabel],
      "target_node": [idField, targetLabel]
    }
    networkSpec.push(staticNetworkSpec)
  }

  console.log(">>>> SPEC:", dataSpec, networkSpec);
  return {
    data: dataSpec,
    network: networkSpec
  }
}