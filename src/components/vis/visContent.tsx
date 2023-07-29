import { Spin } from "antd"
import { useEffect, useState } from "react"
import { NetworkConfig, VisContentOptions } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"

interface IVisContentProps {
  type: string // "explore" || "xplainer"
  viewerId: number
  width: string
  visType: string
  network: string
  options: VisContentOptions
}

function VisContent(props: IVisContentProps) {
  const { viewerId, width, visType, network, options } = props
  const [loading, setLoading] = useState<boolean>(true)

  const containerId = `visSvg${viewerId}`
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  let viewer: any

  // let onCoordination = (newVal: any) => {
  //   console.log('onCoordination:', visType, { newVal })
  //   // viewers.map(viewer => {
  //   //   propogateSelection(viewer, "node_selection", newVal)
  //   // })
  // }

  // function propogateSelection(viewer: any, selectionName: string, newVal: any) {
  //   // Internally NetPanorma represents selections as an object containing an array of selected node objects, and an array of selected link objectes
  //   // This objects must be nodes/links in the correct network (not just identical copies!)
  //   // If the views we are linking use the same identifiers, then we can link them like this:
  //   // This is a bit inelegant: I might add a new method to NetPanorama in future to make it unnecessary.

  //   const nodeIds = newVal.nodes.map((n: any) => n.id);
  //   const linkIds = newVal.links.map((l: any) => l.id);

  //   const networkName = "network"; // the name of the network in which the selection is made - set in specification
  //   const nodes = viewer.state[networkName].nodes.filter((n: any) => nodeIds.includes(n.id));
  //   const links = viewer.state[networkName].links.filter((l: any) => linkIds.includes(l.id));

  //   viewer.setParam(selectionName, { nodes, links })
  // }

  const update = async () => {
    let renderer = visType === 'matrix' ? 'canvas' : 'svg'
    let template = templates.filter(t => t.key === visType)[0]
    let templatePath = props.type === 'explore' ? `./templates/${template.template}` : `./templates/xplainer/${template.template}`
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)

    // @ts-ignore
    viewer = await NetPanoramaTemplateViewer.render(templatePath, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      colorScheme: options.colorScheme,
      nodeTypeInShape: options.nodeTypeInShape,
      nodeTypeShapeScheme: options.nodeTypeShapeScheme,
      nodeLabel: options.nodeLabel,
      lableImportance: options.lableImportance,
      timeRange: options.timeRange
    }, containerId, {
      renderer: renderer,
      // paramCallbacks: {
      //   node_selection: onCoordination
      // }
    })
    // @ts-ignore
    console.log('Spec:', viewer.spec)
    // @ts-ignore
    console.log('VIEW STATE:', viewer.state)
    // @ts-ignore
    // specUrl = "https://netpanorama-editor.netlify.app/?spec=" + encodeURIComponent(JSON.stringify(window.viewer.spec));
    const container = document.getElementById(containerId)
    if (container && container.getElementsByTagName("svg").length > 0) {
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
      // @ts-ignore
      container.getElementsByTagName("svg")[0].style["max-height"] = "100%";
    }
    setLoading(false)

    // TODO: implement it in netpan
    // const svg = d3.select(`#${containerId}`).select('svg')
    // if (svg) {
    //   let g = svg.select("g").select("g")
    //   // @ts-ignore
    //   svg.call(d3.zoom()
    //     // .extent([[0, 0], [width, height]])
    //     // .scaleExtent([1, 8])
    //     .on("zoom", zoomed));

    //   // @ts-ignore
    //   function zoomed({ transform }) {
    //     g.attr("transform", transform);
    //   }
    // }
  }

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) {
      console.error(`No container with id ${containerId}`);
      return
    }
    update()
  })

  return (
    <>
      {loading ? 
        <Spin tip="Loading" size="small">
          <div
            id={containerId}
            style={{ width: width }}
          />
        </Spin> 
        : <div
          id={containerId}
          style={{ width: width }}
        />
      }
    </>
  )
}
export default VisContent