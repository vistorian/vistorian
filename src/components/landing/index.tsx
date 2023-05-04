import { createUseStyles } from 'react-jss'
import { Button } from 'antd'

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    paddingTop: 40,
    width: 350
  },
  subtitle: {
    marginBottom: 30,
    fontWeight: 100,
    fontFamily: `'Poiret One', 'Helvetica Neue', 'sans-serif'`,
    fontSize: '20pt',
    color: '#111111',
    lineHeight: '1.5em'
  },
  visTiles: {
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  visimage: {
    height: 200,
    border: 'solid 1px #eee',
    marginRight: 5,
    marginLeft: 5
  }
})

function Landing() {
  const classes = useStyles()

  const examples: string[] = ['nodelink', 'matrix', 'timearcs', 'map']

  return (
    <div className={classes.root}>
      <img src="./logos/logo-vistorian.png" className ={classes.logo}/>

      <p className={classes.subtitle}>Interactive Visualizations for Dynamic and Multivariate Networks. <br />  Free, online, and open source.</p>

      <div id="vistiles" className={classes.visTiles}>
        {examples.map((example: string) => (
          // TODO: add link
          <a href={`./vis/${example}`} key={example}>
            <img src={`./thumbnails/${example}.png`} className={classes.visimage}/>
          </a>
        ))}
      </div>

      <Button href='./editor'> Start my session</Button>

    </div>
  )
}

export default Landing