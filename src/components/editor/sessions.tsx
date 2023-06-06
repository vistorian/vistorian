import { createUseStyles } from 'react-jss'
import { Session } from '../../../typings'
import templates from '../templates/templates'
import { find } from 'lodash-es'
import { useContext } from 'react'
import { EditorContext } from './context'
import { Link } from 'react-router-dom'

const useStyles = createUseStyles({
  cards: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  card: {
    margin: 20,
    marginLeft: 0,
    background: '#fff',
    boxShadow: '0px 0px 20px 0px #0000000D',
    borderRadius: 6,
    width: 295,
    height: 295,
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'transparent',
      boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
    }
  },
  cardExtra: {
    margin: 20,
    marginLeft: 0,
    background: '#fff',
    boxShadow: '0px 0px 20px 0px #0000000D',
    borderRadius: 6,
    width: 295,
    height: 295,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    height: 'calc(100% - 45px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    height: 45,
    width: '100%',
    background: '#D9D9D9',
    borderRadius: '0px 0px 6px 6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})


function Sessions() {
  const classes = useStyles()

  const {sessionStore, setSessionStore} = useContext(EditorContext)

  const clearSessionStore = () => {
    sessionStore.map((s: Session) => window.localStorage.removeItem("SAVED_SESSION_" + s.id))
    // window.localStorage.removeItem("SAVED_SESSION_" + '1')
    setSessionStore([] as Session[])
  }

  return (
    <>
    <h2>My Sessions</h2>
    <div className={classes.cards}>
        {sessionStore.map((session: Session)=> {
        const img = find(templates, t=>t.key===session.vis)
        return (
          <Link
            to={`/vis/${session.vis}/network/${session.network}`}
            target='_blank'
            key={session.id}
          >
            <div 
              className={classes.card}
            >
              <div className={classes.thumbnail}>
                <img src={`./thumbnails/${img?.image}`} style={{height: 230}} />
              </div>
              <div className={classes.footer}>
                {session.id}-{session.network}
              </div>
            </div>
          </Link>
        )
      })}
        <div
          className={classes.card}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 18 }}
        >
          + Add Session
        </div>
        <div 
          className={classes.card} 
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 18}}
          onClick={clearSessionStore} // for test!!!!!
        >
        - Clear all sessions
      </div>
    </div>
    </>
  )
}

export default Sessions