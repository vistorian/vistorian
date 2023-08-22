import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  },
  func: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(0, 0, 0, 0.16)',
    marginBottom: 10,
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'transparent',
      boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
    }
  }
})

interface IProps {
  type: string
  setType: (t: string) => void
}

function PatternSelection(props: IProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div
        className={classes.func}
        onClick={() => props.setType('all')}
        style={{ background: props.type === 'all' ? 'lightgrey' : 'none' }}
      >
        <i
          className="fa-solid fa-bomb"
          style={{ fontSize: 34 }}
        />
      </div>
      <div 
        className={classes.func} 
        onClick={()=>props.setType('rect')}
        style={{background: props.type === 'rect' ? 'lightgrey' : 'none'}}
      >
        <i
          className="fa-solid fa-vector-square"
          style={{ fontSize: 34}}
        />
      </div>
      <div 
        className={classes.func}
        onClick={() => props.setType('lasso')}
        style={{ background: props.type === 'lasso' ? 'lightgrey' : 'none' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.71333 18.0867C1.61833 16.4667 1 14.6233 1 12.6667C1 6.22333 7.71667 1 16 1C24.2833 1 31 6.22333 31 12.6667C31 19.11 24.2833 24.3333 16 24.3333C12.8117 24.3333 9.85667 23.56 7.42667 22.2417" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 20.9998C1 21.8839 1.35119 22.7317 1.97631 23.3569C2.60143 23.982 3.44928 24.3332 4.33333 24.3332C5.21739 24.3332 6.06523 23.982 6.69036 23.3569C7.31548 22.7317 7.66667 21.8839 7.66667 20.9998C7.66667 20.1158 7.31548 19.2679 6.69036 18.6428C6.06523 18.0177 5.21739 17.6665 4.33333 17.6665C3.44928 17.6665 2.60143 18.0177 1.97631 18.6428C1.35119 19.2679 1 20.1158 1 20.9998Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.33301 24.3335C4.33301 26.7002 4.85967 29.0085 5.99967 31.0002" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default PatternSelection