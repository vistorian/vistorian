import { useContext, useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { EditorContext } from '../context'
import { Button, message } from 'antd'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import templates from '../../templates/templates'
import { Template } from '../../../../typings'

const useStyles = createUseStyles({
    root: {
    display: 'flex',
    width: '100%',
  },
  left: {
    width: 250,
  },
  right: {
    margin: '0px 20px',
    width: '100%',
  },
  visTiles: {
    display: 'flex',
    flexDirection: 'row',
  },
  visTile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 20
  },
  visimage: {
    height: 300,
    border: 'solid 1px #eee',
  }
})

interface IVisEditor {
  name: string
}

interface VisItem {
  key: string
  title: string
}

function VisEditor(props: IVisEditor) {
  const classes = useStyles()
  const { networkStore, setNetworkStore } = useContext(EditorContext)
  const { name } = props
  const [selectedNetwork, setSelectedNetwork] = useState<string>(name)
  // let config: string | null

  // useEffect(()=>{
  //   config = window.localStorage.getItem("NETWORK_DEFINITION_" + selectedNetwork)
  //   console.log('config:', selectedNetwork, config)
  // })

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <h3>
          My Networks
        </h3>
        {networkStore.map((ns: string) => (
          <p key={ns}
            style={{ paddingLeft: 16, margin: 0 }}
          >
            <Button
              type='text'
              style={{ padding: 0, fontWeight: selectedNetwork === ns ? 700 : 500 }}
              onClick={() => setSelectedNetwork(ns)}
            >
              {ns}
            </Button>
          </p>
        ))}
      </div>
      <div className={classes.right}>
        <h2>Select a visualization and start exploring:</h2>
        <div id="vistiles" className={classes.visTiles}>
          {selectedNetwork.length > 0 ? templates.map((template: Template) => (
            <div className={classes.visTile} key={template.key}>
              <Link 
                to={`/vis/${template.key}/network/${selectedNetwork}`} 
                target='_blank'
              >
                <img src={`./thumbnails/${template.key}.png`} className={classes.visimage} />
              </Link>
              <span style={{ textAlign: 'center', fontSize: 18 }}><b>{template.label}</b></span>
            </div>
          )) : 
          templates.map((template: Template) => (
            <div className={classes.visTile} key={template.key}>
              <img src={`./thumbnails/${template.key}.png`} className={classes.visimage} onClick={()=>{message.error('Please first select a network to start your exploration!')}}/>
              <span style={{ textAlign: 'center', fontSize: 18 }}><b>{template.label}</b></span>
            </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default VisEditor