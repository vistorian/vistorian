import { Spin } from "antd"
import { useEffect, useState } from "react"
import { NetworkConfig } from "../../../typings"
import templates from "../templates/templates"
import { genSpecFromLinkTable } from "../templates/genSpec"

interface IVisContentProps {
  viewerId: number
  viewer: any
  setViewer: (v:any) => void
  width: string
  visType: string
  network: string
  options: any  // relate to the vis encoding
  onPropogate: (id: number, newVal: any) => void,
  // stamp: any,
  // setStamp: (s: any) => void
}

function VisContent(props: IVisContentProps) {
  const { viewerId, viewer, setViewer, width, visType, network, options } = props
  const [loading, setLoading] = useState<boolean>(true)
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  const containerId = `visSvg${viewerId}`

  // const onChange = (newVal) => {
  //   const nodeIds = newVal.nodes.map(n => n.id);
  //   const linkIds = newVal.links.map(l => l.id);
  //   const values = { nodes: nodeIds, links: linkIds }
  //   console.log('stamp:', props.stamp)
  //   if (JSON.stringify(props.stamp) !== JSON.stringify(values)) {
  //     props.setStamp(values)
  //     props.onPropogate(viewerId, newVal)
  //   } 
  // }

  const onChange = (newVal) => {
    console.log('onChange:', viewerId)
    props.onPropogate(viewerId, newVal)
  }

  type ParamChangeCallbacks = { [paramName: string]: (newVal: string | number) => void } // refer to netpan
  const getParamCallbacks: ParamChangeCallbacks = { node_selection: onChange }

  const update = async () => {
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
      ...options
    }, containerId, {
      renderer: renderer,
      paramCallbacks: getParamCallbacks
    })
    // @ts-ignore
    console.log('VIEW STATE:', viewerId, tmpViewer.state)
    // console.log(JSON.stringify(tmpViewer.spec))
    setViewer(tmpViewer)
    
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

    if (loading) setLoading(false)
  }

  const resizeChange = () => {
    const container = document.getElementById(containerId)
    if (!container) {
      console.error(`No container with id ${containerId}`);
      return
    }
    update()
  }

  useEffect(() => {
    resizeChange()
  }, [loading])

  useEffect(() => {
    window.addEventListener('resize', resizeChange)
    return () => window.removeEventListener('resize', resizeChange)
  })

  // rendering
  return (
    loading ?
      (<Spin tip="Loading" size="small">
        <div id={containerId} style={{ width: width, height: '100%' }} />
      </Spin>)
      :
      (<div id={containerId} style={{ width: width, height: '100%' }} />)
  )
}
export default VisContent