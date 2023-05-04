import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    justifyContent: 'start',
  },
  logo: {
    width: 230,
  }
})

function Header() {
  const classes = useStyles()

  return (
    <div id="header" className={classes.root}>
      <a href="./">
        <img src="./logos/logo-vistorian.png" className={classes.logo} />
      </a>
    </div>
  )
}

export default Header