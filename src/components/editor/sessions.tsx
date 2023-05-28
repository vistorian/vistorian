import { createUseStyles } from 'react-jss'
import { Session } from '../../../typings'
import templates from '../templates/templates'
import { find } from 'lodash-es'

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
    height: 295
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

  const sessions: Session[] = [{ name: 'session-1', network: 'test', vis: 'nodelink'}]

  return (
    <>
    <h2>My Sessions</h2>
    <div className={classes.cards}>
      {sessions.map((session: Session)=> {
        const img = find(templates, t=>t.key===session.vis)
        return (
          <div className={classes.card} key={session.name}>
            <div className={classes.thumbnail}>
              <img src={`./thumbnails/${img?.image}`} style={{width: 250}} />
            </div>
            <div className={classes.footer}>
              {session.name}
            </div>
          </div>
        )
      })}
      <div className={classes.cardExtra}>
        + Add Session
      </div>
    </div>
    </>
  )
}

export default Sessions