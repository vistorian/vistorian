import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import templates from '../templates/templates'
import { find } from 'lodash-es'
import { NetworkConfig } from '../../../typings'
import { genSpecFromLinkTable } from '../templates/genSpec'
import { createUseStyles } from 'react-jss'
import { Button } from 'antd'
import Legend from './legend'
import { defaultLinkTypeColorScheme, defaultNodeTypeShapeScheme } from '../../../typings/constant'

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: '100%',
  },
  left: {
    width: 280,
    height: '100%',
    borderRight: '1px solid #d9d9d9',
    marginRight: 20,
    paddingRight: 20
  },
  right: {
    width: "calc(100% - 320px)"
  },
  header: {
    display: "flex",
    flexDirection: "column",
  },
})

function Vis() {
  const classes = useStyles()
  const { visType, network } = useParams()

  const template = find(templates, (tp)=>tp.key === visType)
  const networkCfg = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig

  const [linkTypeColorScheme, setLinkTypeColorScheme] = useState(defaultLinkTypeColorScheme)
  const [nodeTypeShapeScheme, setNodeTypeShapeScheme] = useState(defaultNodeTypeShapeScheme)

  let spec: any = genSpecFromLinkTable(networkCfg, visType as string)

  const update = async () => {
    const containerId = "vis-SVG";
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`No container with id ${containerId}`);
      return;
    }

    // decrease rendering time for matrix
    let renderer = visType === 'matrix' ? "canvas" : "svg"

    // @ts-ignore
    window.viewer = await NetPanoramaTemplateViewer.render(`./templates/${template.template}`, {
      dataDefinition: JSON.stringify(spec.data),
      networksDefinition: JSON.stringify(spec.network),
      linkTypeColorScheme: `"${linkTypeColorScheme}"`,
      nodeTypeShape: nodeTypeShapeScheme
    }, containerId, { renderer: renderer })
    // @ts-ignore
    const specString = JSON.stringify(window.viewer.spec)
    // @ts-ignore
    console.log('Spec:', window.viewer.spec)
    // @ts-ignore
    console.log('VIEW STATE:', window.viewer.state)
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
    <div className={classes.root}>
        <div className={classes.left}>
          <div className={classes.header}>
            <a href="./" style={{ marginBottom: "20px", }}>
              <img src="./logos/logo-vistorian.png" style={{ width: 200 }} />
            </a>
            {/* <Button
              type='primary'
              style={{ marginBottom: 10, marginRight: 10 }}
              onClick={() => {}}
            >
              Exploration
            </Button>
            <Button
              type='primary'
              style={{ marginBottom: 10, marginRight: 10 }}
              onClick={() => { }}
            >
              Design
            </Button> */}
          </div>
          
          {/* show network names */}
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <span style={{background: '#eee', marginBottom: 3, fontSize: 18}}><b>Network:</b>&nbsp;{network}</span>
            {/* TODO: return to network preview */}
            <Link
              to='./'
              target='_blank'
            >
              Return to Network View
            </Link>
          </div>

          {/* show legends */}
          <Legend 
            config={networkCfg} 
            schemes={{linkType: linkTypeColorScheme, nodeType: nodeTypeShapeScheme}} 
          />
        </div>
        
        {/* render netpanorama */}
        <div id="vis-SVG" className={classes.right} />
    </div>
  )
}

export default Vis