import { createUseStyles } from 'react-jss'
import { useContext, useEffect, useState } from 'react';
import { Table, Checkbox, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DataFile } from '../../../../typings';
import { EditorContext } from '../context';
import { findIndex, cloneDeep } from 'lodash-es'



const useStyles = createUseStyles({
  json: {
    backgroundColor: 'rgb(229 231 235)',
    overflow: 'scroll',
    maxHeight: '70vh',
  }
})

interface IDataPreview {
  preview: DataFile
}

function DataPreview(props: IDataPreview) {
  const classes = useStyles()
  const { preview } = props
  const { fileNameStore, setFileNameStore } = useContext(EditorContext)
  const [checked, setChecked] = useState(preview.hasHeader)
  const data = window.localStorage.getItem("UPLOADED_FILE_" + preview.name)

  const setHasHeader = () => {
    const idx = findIndex(fileNameStore, (fn: DataFile) => fn.name === preview.name)
    if (idx > -1) {
      const tmp = cloneDeep(fileNameStore)
      tmp[idx].hasHeader = !checked
      setFileNameStore(tmp)
      setChecked(!checked)
    }
    else {
      message.error('Can not find the file in the store.')
    }
  }

  const csvToJson = (data: string) => {
    let lines = data.split("\n");
    let result = new Array<object>()

    // Extract the header line
    const headers = lines[0].split(",");

    const columns = headers.map(header => {
      return {
        title: header,
        dataIndex: header,
        key: header,
      }
    })

    lines.map((line) => {
      let obj = {}
      let currentLine = line.split(",")
      for (let j = 0; j < headers.length; j++) {
        // @ts-ignore
        obj[headers[j]] = currentLine[j];
      }
      result.push(obj);
    })
    return {
      columns: columns,
      data: result
    }
  }

  useEffect(()=>{}, [])

  const renderPreview = () => {
    if (data && preview.name.endsWith('.json')){
      return (
        <div className={classes.json}>
          <code>
            <pre>{JSON.stringify(JSON.parse(data), null, 4)}</pre>
          </code>
        </div>
      )
    }
    else if (data && preview.name.endsWith('.csv')) {
      const result = csvToJson(data)
      return (
        <>
          <Checkbox 
            checked={checked}
            onChange={() => setHasHeader()}
          >
            Has header row?
          </Checkbox>
          <Table
            showHeader={checked}
            columns={result.columns}
            dataSource={result.data}
          >
          </Table>
        </>
      )
    }
  }

  return (
    <div className='root'>
      <h3>Preview of {preview.name}</h3>
      {renderPreview()}
    </div>
  )
}

export default DataPreview