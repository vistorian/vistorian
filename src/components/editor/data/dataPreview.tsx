import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  json: {
    backgroundColor: 'rgb(229 231 235)',
    overflow: 'scroll',
    maxHeight: '70vh',
  }
})

interface IDataPreview {
  preview: string
}

function DataPreview(props: IDataPreview) {
  const classes = useStyles()
  const { preview } = props
  const data = window.localStorage.getItem("UPLOADED_FILE_" + preview)

  const renderPreview = () => {
    if (data && preview.endsWith('.json')){
      return (
        <div className={classes.json}>
          <code>
            <pre>{JSON.stringify(JSON.parse(data), null, 4)}</pre>
          </code>
        </div>
      )
    }
    else if (data && preview.endsWith('.csv')) {
      return (
        <></>
      )
    }
  }

  return (
    <div className='root'>
      <h3>Preview of {preview}</h3>
      {renderPreview()}
    </div>
  )
}

export default DataPreview