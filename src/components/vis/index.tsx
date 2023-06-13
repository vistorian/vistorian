import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import templates from '../templates/templates'
import { find } from 'lodash-es'
import { NetworkConfig } from '../../../typings'

function Vis() {
  const { visType, network } = useParams()
  const template = find(templates, (tp)=>tp.key === visType)

  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  console.log('network:', networkCfg)

  const update = async () => {
    const containerId = "SVG";
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`No container with id ${containerId}`);
      return;
    }
    // TODO: need to update to the right spec
    const dataSpec = [{
      "name": "data",
      "url": './data/marieboucher.csv',
      "format": { "type": "csv" }
    }]
    const networks = [{
      "name": "network",
      "parts": [
        {
          "data": "data",
          "yieldsLinks": [
            {
              "source_id": { "field": "Name1" },
              "source_node_type": "person",
              "source_id_field": "id",

              "target_id": { "field": "Name2" },
              "target_node_type": "person",
              "target_id_field": "id",

              "data": ["*"]
            }
          ]
        }
      ],
      "transform": [
        { "type": "metric", "metric": "degree" }
      ]
    }]
    // @ts-ignore
    window.viewer = await NetPanoramaTemplateViewer.render(`./templates/${template.template}`, {
      dataDefinition: JSON.stringify(dataSpec),
      networksDefinition: JSON.stringify(networks),
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