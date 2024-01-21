import { Spin } from "antd"
import { useEffect, useState } from "react"
import { NetworkConfig } from "../../../../typings"
import templates from "../../templates/templates"
import { genSpecFromLinkTable } from "../../templates/genSpec"

interface IVisContentProps {
  visTypes: string
  network: string
  options: any  // relate to the vis encoding
}

function VisContent(props: IVisContentProps) {
  const visTypeList = props.visTypes.split('+') as string[]
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + props.network) as string) as NetworkConfig

  let viewer1 = {}, viewer2 = {}

  let stamp = {}

  const propogateSelection = (viewer, selectionName, values) => {
    console.log('propogateSelection', stamp)
    const networkName = "network"; 
    const nodes = viewer.state[networkName].nodes.filter(n => values.nodes.includes(n.id));
    const links = viewer.state[networkName].links.filter(l => values.links.includes(l.id));
    viewer.setParam(selectionName, { nodes, links })
  }


  const onChange = (newVal) => {
    const nodeIds = newVal.nodes.map(n => n.id);
    const linkIds = newVal.links.map(l => l.id);
    const values = {nodes: nodeIds, links: linkIds}
    console.log('stamp',stamp, viewer1, viewer2)
    if (JSON.stringify(values) !== JSON.stringify(stamp)) {
      stamp = values
      propogateSelection(viewer1, "node_selection", values)
      propogateSelection(viewer2, "node_selection", values)
    }
  }

  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks: ParamChangeCallbacks = { node_selection: onChange }

  const update = async (index: number, visType: string) => {
    const containerId = `visSvg${index}`
    let renderer = visType === 'matrix' ? 'canvas' : 'svg'

    let template = templates.filter(t => t.key === visType)[0]
    let templatePath = `./templates/${template.template}`
    let spec: any = genSpecFromLinkTable(networkCfg, visType as string)
    // console.log('spec:', spec)

    // @ts-ignore
    let tmpViewer = await NetPanoramaTemplateViewer.render(templatePath, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      width: document.getElementById(containerId)?.getBoundingClientRect().width,
      height: document.getElementById(containerId)?.getBoundingClientRect().height,
      ...props.options
    }, containerId, {
      renderer: renderer,
      paramCallbacks: getParamCallbacks
    })
    // @ts-ignore
    console.log('VIEW STATE:', index, tmpViewer.state)
    // console.log(JSON.stringify(tmpViewer.spec))
    if (index === 0) {
      viewer1 = tmpViewer
    }
    else
      viewer2 = tmpViewer
    
    const container = document.getElementById(containerId)
    if(container){
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
      // d3.select(`#${containerId}`).selectAll('text').attr('pointer-events', 'none')
    }

    // if (loading) setLoading(false)
  }

  const resizeChange = () => {
    for (let index in visTypeList) {
      const containerId = `visSvg${index}`
      const container = document.getElementById(containerId)
      if (!container) {
        console.error(`No container with id ${containerId}`);
        return
      }
      update(Number(index), visTypeList[Number(index)])
    }
  }

  useEffect(() => {
    window.addEventListener('resize', resizeChange)
    return () => window.removeEventListener('resize', resizeChange)
  })

  // rendering
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {visTypeList.map((visType, idx) => {
        return (
          <div key={idx} id={`visSvg${idx}`} 
            style={{ width: `${100/visTypeList.length}%`, height: '100%' }} />
        )
      })}
    </div>
  )
}
export default VisContent