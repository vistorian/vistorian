import { createUseStyles } from 'react-jss'
import { useContext, useEffect, useState } from 'react';
import { Table, Checkbox, message, Button } from 'antd';
import { DeleteFilled, CopyFilled, EditFilled, CheckCircleFilled } from '@ant-design/icons'
import { DataFile } from '../../../../typings';
import { EditorContext } from '../context';
import { findIndex, cloneDeep } from 'lodash-es';
import csvtojson from 'csvtojson';
import styled from '@emotion/styled';


const useStyles = createUseStyles({
  json: {
    backgroundColor: 'rgb(229 231 235)',
    overflow: 'scroll',
    maxHeight: '70vh',
  },
})

interface IDataPreview {
  preview: DataFile
}

function DataPreview(props: IDataPreview) {
  const classes = useStyles()
  const { preview } = props
  const data = window.localStorage.getItem("UPLOADED_FILE_" + preview.name)
  const { fileNameStore, setFileNameStore } = useContext(EditorContext)

  const [checked, setChecked] = useState(preview.hasHeader)
  const [columnInTable, setColumnInTable] = useState<any[]>([])
  const [dataInTable, setDataInTable] = useState<any[]>([])

  // const setHasHeader = () => {
  //   const idx = findIndex(fileNameStore, (fn: DataFile) => fn.name === preview.name)
  //   if (idx > -1) {
  //     const tmp = cloneDeep(fileNameStore)
  //     tmp[idx].hasHeader = !checked
  //     setFileNameStore(tmp)
  //     setChecked(!checked)
  //   }
  //   else {
  //     message.error('Can not find the file in the store.')
  //   }
  // }

  const MyButton = styled(Button)({
    marginLeft: 10
  })


  const convertCsvToJson = async (csvData: string): Promise<any[]> => {
    const jsonArray = await csvtojson().fromString(csvData)
    return jsonArray
  }

  useEffect(() => {
    if (data && preview.name.endsWith('.csv')) {
      // TODO: deal with no fakeHeader
      convertCsvToJson(data)
        .then((jsonData) => {
          const headers = Object.keys(jsonData[0])
          const columns = headers.map(header => {
            return {
              title: header,
              dataIndex: header,
              key: header,
            }
          })
          setColumnInTable(columns)
          const dataintable = jsonData.map((d, i) => {
            d._rowKey = i
            return d
          })
          setDataInTable(dataintable)
        })
        .catch((error) => {
          message.error('Error during CSV to JSON conversion:');
        })
    }
    else {
      message.error('There is no such data file in the storage!')
    }
    
  }, [preview])

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
      return (
        <>
          <Checkbox 
            checked={checked}
            style={{marginBottom: 10}}
            // onChange={() => setHasHeader()}
          >
            Has header row?
          </Checkbox>
          <Table
            columns={columnInTable}
            dataSource={dataInTable}
            rowKey={(record) => record._rowKey}
            showHeader={checked}
          >
          </Table>
        </>
      )
    }
  }

  return (
    <div className='root'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <h2>{preview.name}</h2>
          <Button
            icon={<EditFilled />}
            type='text'
            shape='circle'
            // onClick={() => setEditOpen(true)}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <MyButton 
            icon={<EditFilled />}
            type='primary'
            // onClick={() => setEditOpen(true)}
          >
            Edit data
          </MyButton>
          <MyButton
            icon={<CopyFilled />}
            type='primary'
          // onClick={() => setEditOpen(true)}
          >
            Duplicate
          </MyButton>
          <MyButton
            icon={<DeleteFilled />}
            type='primary'
          // onClick={() => handleSelectToDelete(type, data)}
          >
            Delete
          </MyButton>
        </div>
      </div>

      {renderPreview()}

    </div>
  )
}

export default DataPreview