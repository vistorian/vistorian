import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import templates from '../templates/templates'
import { find } from 'lodash-es'
import { NetworkConfig } from '../../../typings'
import { genSpecFromLinkAndNodeTable, genSpecFromLinkTable } from '../templates/genSpec'
import { createUseStyles } from 'react-jss'
import { Button } from 'antd'

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: '100%',
  },
  left: {
    width: 300,
    height: '100%',
    borderRight: '1px solid #d9d9d9',
    marginRight: 20,
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

  let spec: any
  if (!networkCfg.extraNodeConfig?.hasExtraNode) {
    spec = genSpecFromLinkTable(networkCfg)
  }
  else {
    spec = genSpecFromLinkAndNodeTable(networkCfg)
  }
  console.log('vis:', spec)

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
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <span style={{background: '#eee', marginRight: 20, marginBottom: 3, padding: 5, fontSize: 18}}><b>Network:</b>&nbsp;{network}</span>
            {/* TODO: return to network preview */}
            <Link
              to='./'
              target='_blank'
              style={{paddingLeft: 5}}
            >
              Return to Dataview
            </Link>
          </div>
        </div>
        
        {/* render netpanorama */}
        <div id="SVG" className={classes.right} />
    </div>
  )
}

export default Vis