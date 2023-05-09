import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  preview: {
    backgroundColor: 'rgb(229 231 235)',
    overflow: 'scroll',
    maxHeight: '70vh',
  }
})

interface INetPreview {
  preview: string
}

function NetPreview(props: INetPreview) {
  const classes = useStyles()
  const { preview } = props

  const renderPreview = () => {
    const data = window.localStorage.getItem("NETWORK_DEFINITION_" + preview)

    return (
      <div className={classes.preview}>
        <code>
          <pre>{data && JSON.stringify(JSON.parse(data), null, 4)}</pre>
        </code>
      </div>
    )
  }

  return (
    <div className='root'>
      <h3>Preview of {preview}</h3>
      {renderPreview()}
    </div>
  )
}

export default NetPreview