import { useContext, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { Button, message, Typography } from 'antd'
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import "leaflet/dist/leaflet.css";

import templates from '../../templates/templates'
import { NetworkConfig, Template } from '../../../../typings'
import { WizardContext } from '../context'

const { Title } = Typography

const useStyles = createUseStyles({
  visTiles: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  visTile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    margin: 20,
    cursor: "pointer"
  },
  visimage: {
    height: 160,
    width: 160  ,
    border: 'solid 1px #f0f0f0',
    borderRadius: '50%',
    '&:hover': {
      borderColor: 'transparent',
      boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
    }
  },
  visimageGray: {
    height: 160,
    width: 160,
    border: 'solid 1px #f0f0f0',
    borderRadius: '50%',
    filter: 'blur(1px) grayscale(15%)',
    opacity: 0.6
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 30
  }
})

interface IVisSelectorProps {
  network: string
}

function VisSelector(props: IVisSelectorProps) {
  const classes = useStyles()
  const { network } = props
  const config = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + network) as string) as NetworkConfig
  // console.log('VisSelector:', network, window.localStorage.getItem("NETWORK_WIZARD_" + network))

  const { sessionStore, setSessionStore } = useContext(WizardContext)
  const [selected, setSelected] = useState<boolean[]>(new Array(templates.length).fill(false))

  const saveSession = (vis: string[]) => {
    let maxId = Math.max(...sessionStore.map(s => s.id))
    maxId = isFinite(maxId) ? maxId : 0
    const newSession = {
      id: maxId+1,
      network: network,
      vis: vis.join('+'),
      created: new Date().toLocaleString('en-GB', {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      })
    }
    window.localStorage.setItem("SAVED_SESSION_" + newSession.id, JSON.stringify(newSession))
    setSessionStore([...sessionStore, newSession])
  }

  const handleSelect = (e:React.MouseEvent, idx: number) => {
    let tmp = [...selected]
    tmp[idx] = !selected[idx]
    setSelected(tmp)
  }
  
  const getVis = () => {
    let result: string[] = []
    selected.forEach((s, i) => {
      if (s) {
        result.push(templates[i].key)
      }
    })
    return result
  }

  const isValid = (visType: string) => {
    if (!config) {
      console.error('no valid specification!')
      return false
    }
    if (visType === 'map') {
      if ((!config.linkTableConfig?.locationOfSourceNode || !config.linkTableConfig?.locationOfTargetNode) && !config.extraNodeConfig?.nodeLocation) {
        return false
      }
    }
    if (visType === 'timearcs' && !config.linkTableConfig?.withTime) {
      return false
    }
    return true
  }

  return (
    <>
      <Title level={3}>Select a visualization and start exploring:</Title>
      <div className={classes.visTiles}>
        {network.length > 0 ? 
          templates.map((template: Template, idx: number) => (
            <div className={classes.visTile} key={template.key}>
              {isValid(template.key) ? 
                <div style={{ position: 'relative' }}
                  onClick={(e) => handleSelect(e, idx)} >
                  <img
                    src={`./thumbnails/${template.image}`}
                    className={classes.visimage}
                  />
                  {selected[idx] ?
                    <CheckCircleFilled className={classes.icon} style={{ color: "#E17918" }} />
                    : <CheckCircleOutlined className={classes.icon} style={{ color: "#eee" }} />}
                </div> : 
                <div style={{ position: 'relative' }} >
                  <img
                    src={`./thumbnails/${template.image}`}
                    className={classes.visimageGray}
                  />
                </div>
                }
              <span style={{ 
                textAlign: 'center', 
                fontSize: 15, 
                width: 160,
                marginTop: '10px', 
                fontWeight: 'bold'
                }}>{template.label}
              </span>
              <span style={{ 
                textAlign: 'center', 
                fontSize: 11, 
                width: 160, 
                // marginBottom: '10px', 
                }}>{template.description}
              </span>
              {isValid(template.key) ? null : <span style={{
                textAlign: 'center',
                fontSize: 11,
                width: 160,
                color: 'red', 
              }}>{template.error}
              </span>}
            </div>
          )) 
          : null
          // TODO: when there is no selected network
        }
      </div>
      <Link
        onClick={() => saveSession(getVis())}
        to={`/vis/${getVis().join('+')}/network/${network}`}
        target='_blank'
      >
        <Button style={{
          float: 'right',
          height: '37px',
          width: '150px',
          fontSize: '14pt',
          textDecoration: 'none',
          fontFamily: `'Reem Kufi Fun', 'Helvetica Neue', 'sans-serif'`,
          }} 
          type="primary">{`Visualize (${selected.filter(s=>s).length})`}</Button>
      </Link>
    </>
  )
}

export default VisSelector