import { createUseStyles } from "react-jss"
import { NetworkPattern } from "./motifs/motif"
import { patternList } from "./patternList"
import { message } from "antd"

const useStyles = createUseStyles({
  hl: {
    position: 'relative',
    fontWeight: 600,
    '&:after': {
      content: '""',
      backgroundColor: '#FFE0B2',
      height: '45%',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '100%',
      zIndex: -1,
    }
  }
})

interface IPatternProps {
  motif: NetworkPattern
}

function Pattern (props: IPatternProps) {
  const { motif } = props
  const classes = useStyles()

  let pattern
  if (motif) {
    if (motif.type() in patternList) {
      pattern = patternList[motif.type()]
    }
    else {
      message.error('No matching pattern!!')
    }
  }

  const genDescription = () => {
    switch (motif.type()) {
      case 'Clique':
        return <span>the clique has <span className={classes.hl}>{motif.nodes.length}</span> nodes, 
        and the link density is <span className={classes.hl}>{`100%`}</span>.</span>
      case 'Cluster':
        return <span></span>
      case 'Bridge':
        return <span></span>
      case 'Bridge':
        return <span></span>
      case 'Bridge':
        return <span></span>
      default:
        return <span>no matching description.</span>
    }
  }

  return (
    <>
      {pattern ? 
        <div style={{ padding: 12}}>
          {/* title */}
          <div>
            <span style={{ fontSize: 32, fontWeight: 600, marginRight: 8 }}>{pattern.title}</span>
            <span>Pattern</span>
          </div>
          {/* description */}
          <div>
            <span>{pattern.explanation}</span>
          </div>
          {/* explain your selection */}
          <div style={{ marginTop: 25}}>
            <span style={{ fontWeight: 600}}>{`In this particular case, `}</span>
            {genDescription()}
          </div>
          {/* relate to variants */}
          <div style={{ marginTop: 25 }}>
            <span style={{ fontSize: 20, fontWeight: 600}}>Variants:</span>
            <br />
            <ul>
              {pattern.variants.map((v) => (<li>{v}</li>))}
            </ul>
          </div>
        </div> : null}
    </>
  )
}

export default Pattern