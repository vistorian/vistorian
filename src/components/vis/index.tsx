import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import templates from '../templates/templates'
import { find } from 'lodash-es'
import { NetworkConfig } from '../../../typings'
import { genSpecFromLinkAndNodeTable, genSpecFromLinkTable } from '../templates/genSpec'

function Vis() {
  const { visType, network } = useParams()
  const template = find(templates, (tp)=>tp.key === visType)

  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  let spec: any

  if (!networkCfg.extraNodeConfig?.hasExtraNode) {
    spec = genSpecFromLinkTable(networkCfg)
  }
  else {
    spec = genSpecFromLinkAndNodeTable(networkCfg)
  }
  console.log('network:', spec)

  const update = async () => {
    const containerId = "SVG";
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`No container with id ${containerId}`);
      return;
    }

    // @ts-ignore
    window.viewer = await NetPanoramaTemplateViewer.render(`./templates/${template.template}`, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
    }, "SVG")

    // @ts-ignore
    const specString = JSON.stringify(window.viewer.spec)
    // @ts-ignore
    specUrl = "https://netpanorama-editor.netlify.app/?spec=" + encodeURIComponent(specString);

    // @ts-ignore
    container.getElementsByTagName("svg")[0].style["max-width"] = "100%";
    // @ts-ignore
    container.getElementsByTagName("svg")[0].style["max-height"] = "100%";

    //  return viewer;
  }

  useEffect(() => {
    update()
  })

  return (
    <div className='vis'>
        <div id="SVG" />
    </div>
  )
}

export default Vis