import { useContext, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { message } from 'antd'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import templates from '../../templates/templates'
import { Template } from '../../../../typings'
import { EditorContext } from '../context'

const useStyles = createUseStyles({
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
    border: 'solid 1px #f0f0f0',
    borderRadius: 8,
    '&:hover': {
      borderColor: 'transparent',
      boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
    }
  }
})

interface IVisEditor {
  name: string
}

function VisEditor(props: IVisEditor) {
  const classes = useStyles()
  const { name } = props

  const { sessionStore, setSessionStore } = useContext(EditorContext)

  const saveSession = (vis: string) => {
    let maxId = Math.max(...sessionStore.map(s => s.id))
    maxId = isFinite(maxId) ? maxId : 0
    const newSession = {
      id: maxId+1,
      network: name,
      vis: vis
    }
    window.localStorage.setItem("SAVED_SESSION_" + newSession.id, JSON.stringify(newSession))
    setSessionStore([...sessionStore, newSession])
  }

  return (
    <div>
      <h2>Select a visualization and start exploring:</h2>
      <div id="vistiles" className={classes.visTiles}>
        {name.length > 0 ? 
          templates.map((template: Template) => (
            <div className={classes.visTile} key={template.key}>
              <Link 
                onClick={() => saveSession(template.key)}
                to={`/vis/${template.key}/network/${name}`} 
                target='_blank'
              >
                <img 
                  src={`./thumbnails/${template.image}`} 
                  className={classes.visimage} 
                />
              </Link>
              <span style={{ textAlign: 'center', fontSize: 18 }}><b>
                {template.label}
              </b></span>
            </div>
          )) 
          : 
          // when there is no selected network
          // TODO: maybe can be removed
          templates.map((template: Template) => (
            <div className={classes.visTile} key={template.key}>
              <img 
                src={`./thumbnails/${template.image}`} 
                className={classes.visimage} 
                onClick={()=>{message.error('Please first select a network to start your exploration!')}}
              />
              <span style={{ textAlign: 'center', fontSize: 18 }}><b>
                {template.label}
              </b></span>
            </div>
            ))
        }
      </div>
    </div>
  )
}

export default VisEditor