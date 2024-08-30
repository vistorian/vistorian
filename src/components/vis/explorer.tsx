import {Spin} from "antd"
import {useEffect, useState} from "react"
import {NetworkConfig} from "../../../typings"
import templates from "../templates/templates"
import {genSpecFromLinkTable} from "../templates/genSpec"

import {render} from "../../../public/lib/netpanorama-template-viewer";


interface IVisContentProps {
  visTypeList: string[]
  network: string
  options: any  // relate to the vis encoding
}

function Explorer(props: IVisContentProps) {
  const {visTypeList, network, options} = props
  const [loading, setLoading] = useState<boolean>(true)
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  const viewers: any[] = visTypeList.map(v => {
    return {}
  })

  const onChange = (newVal: any, type: string) => {
    // console.log('onChange before:', newVal, type)
    viewers.map(viewer => {
      // @ts-ignore
      // console.log('on Change:', viewer.state)
      if (viewer.state !== undefined) {
        if (type === 'time') {
          viewer.setParam('time', newVal, false)
        } else {
          propogateSelection(viewer, type, newVal)
        }
      }
    })
  }

  const propogateSelection = (viewer, selectionName, newVal) => {
    // Internally NetPanorma represents selections as an object containing an array of selected node objects, and an array of selected link objectes
    // This objects must be odes/links in the correct network (not just identical copies!)
    // If the views we are linking use the same identifiers, then we can link them like this:
    // This is a bit inelegant: I might add a new method to NetPanorama in future to make it unnecessary.

    const nodeIds = newVal.nodes.map(n => n.id);
    const linkIds = newVal.links.map(l => l.id);

    const networkName = "network"; // the name of the network in which the selection is made - set in specification
    const nodes = viewer.state[networkName].nodes.filter(n => nodeIds.includes(n.id));
    const links = viewer.state[networkName].links.filter(l => linkIds.includes(l.id));

    viewer.setParam(selectionName, {nodes, links}, false)
  }

  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks: ParamChangeCallbacks = {
    hoveredNode: (newVal) => onChange(newVal, 'hoveredNode'),
    time: (newVal) => onChange(newVal, 'time'),
  }

  const update = async () => {
    for (let index in visTypeList) {
      let visType = visTypeList[index]
      // let renderer = visType === 'matrix' ? 'canvas' : 'svg'
      let renderer = "svg"
      // TODO: hard code, to be refined with canvas interaction
      if (visType === 'matrix' || visType === 'arcMatrix') {
        renderer = "canvas"
      }

      let containerId = `visSvg${index}`
      let template = templates.filter(t => t.key === visType)[0]
      let templatePath = `./templates/${template.template}`
      let spec: any = genSpecFromLinkTable(networkCfg, visType as string)

      let width = document.getElementById(containerId)?.getBoundingClientRect().width as number
      let height = (document.getElementById(containerId)?.getBoundingClientRect().height as number) - 120
      if (visType === 'nodelink_circular' || visType === 'matrix' || visType === 'arcMatrix') {
        width = width < height ? width : height
        height = width
      }

      // Setup ordering variables
      let orderingMethods = ["optimal-leaf-order", "barycentre", "bandwidth-reduction", "pca", "degree"]
      let orderingMethodsLabels = ["Optimal-leaf-order", "Barycentre", "Bandwidth-reduction", "PCA", "Degree"]

      orderingMethods.push(networkCfg.extraNodeConfig?.nodeLabel ? "data." + networkCfg.extraNodeConfig?.nodeLabel : "id");
      orderingMethodsLabels.push(networkCfg.extraNodeConfig?.nodeLabel ?? "Label");

      let nodeAttributes = ["degree"];

      if (networkCfg.extraNodeConfig?.nodeTypes) {
        orderingMethods = orderingMethods.concat(networkCfg.extraNodeConfig.nodeTypes.filter(att => att).map(v => `data.${v}`))
        orderingMethodsLabels = orderingMethodsLabels.concat(networkCfg.extraNodeConfig.nodeTypes.filter(att => att))
      }


      if (networkCfg.extraNodeConfig?.numericalNodeAttributes) {
        nodeAttributes = nodeAttributes.concat(networkCfg.extraNodeConfig.numericalNodeAttributes.filter(att => att).map(v => `data.${v}`))

        orderingMethods = orderingMethods.concat(networkCfg.extraNodeConfig.numericalNodeAttributes.filter(att => att).map(v => `data.${v}`))
        orderingMethodsLabels = orderingMethodsLabels.concat(networkCfg.extraNodeConfig.numericalNodeAttributes.filter(att => att))
      }

      console.log("attrs ", nodeAttributes)
      // console.log("attrs ", networkCfg.extraNodeConfig)
      console.log("options ", options)
      console.log("config ", networkCfg)

      // @ts-ignore
      // viewers[index] = await NetPanoramaTemplateViewer.render(templatePath, {
      viewers[index] = await render(templatePath, {
        dataDefinition: JSON.stringify(spec.data),
        networksDefinition: JSON.stringify(spec.network),
        width: width,
        height: height,
        nodeAttributes: nodeAttributes,
        isDirected: networkCfg.linkTableConfig?.directed ? true : "false",
        orderingMethods: orderingMethods,
        orderingMethodsLabels: orderingMethodsLabels,
        ...options
      }, containerId, {
        renderer: renderer,
        paramCallbacks: getParamCallbacks
      })
      //, {state}
      // @ts-ignore
      console.log('VIEW STATE:', viewers)
      // console.log(JSON.stringify(tmpViewer.spec))

      const container = document.getElementById(containerId)
      if (container) {
        container.style["border"] = "1px solid #eee";
        container.style["margin-right"] = "5px";
        container.style["padding"] = "10px";
        container.style["borderRadius"] = "10px";
      }
      if (container && container.getElementsByTagName("svg").length > 0) {
        // @ts-ignore
        container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
        // @ts-ignore
        container.getElementsByTagName("svg")[0].style["max-height"] = "100%";
        // console.log(container.getElementsByTagName("text"))
        const elements = container.getElementsByTagName("text")
        // Object.values(elements).map(c => console.log(c))
      }
    }

    if (loading) setLoading(false)
  }

  const resizeChange = () => {
    console.log("RESIZECHANGE")

    visTypeList.map((visType, idx) => {
      const container = document.getElementById(`visSvg${idx}`)
      if (!container) {
        // console.error(`No container with id ${`visSvg${idx}`}`);
        return
      }
    })
    update()
  }

  useEffect(() => {
    resizeChange()
  }, [loading])

  useEffect(() => {
    window.addEventListener('resize', resizeChange)
    return () => window.removeEventListener('resize', resizeChange)
  })

  return (
      loading ?
          (<Spin tip="Loading" size="small">
            <div style={{width: '100%', height: '100%', display: 'flex'}}/>
          </Spin>)
          :
          (<div style={{width: '100%', height: '100%', display: 'flex'}}>
            {visTypeList.map((visType, idx) => {
              return (
                  <div key={idx} id={`visSvg${idx}`}
                       style={{width: `${100 / visTypeList.length}%`, height: '100%', overflow: 'hidden'}}/>
              )
            })}
          </div>)
  )
}

export default Explorer