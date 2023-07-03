import { createUseStyles } from 'react-jss'
import { useContext, useEffect, useState } from 'react';
import { Table, Checkbox, message, Button, Tooltip, Input, Modal, theme } from 'antd';
import { DeleteFilled, CopyFilled, EditFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { DataFile } from '../../../../typings';
import { WizardContext } from '../context';
import styled from '@emotion/styled';
import { handleCopy, handleDelete, handleRename } from '../utils';


const useStyles = createUseStyles({
  json: {
    backgroundColor: 'rgb(229 231 235)',
    overflow: 'scroll',
    maxHeight: '70vh',
  },
})

interface IDataPreviewProps {
  selectedData: DataFile
  setPreview: (data: string) => void
  setMain: (data: string) => void
}

function DataPreview(props: IDataPreviewProps) {
  const classes = useStyles()
  const { selectedData, setPreview, setMain } = props
  const { fileNameStore, setFileNameStore } = useContext(WizardContext)

  const data = window.localStorage.getItem("UPLOADED_FILE_" + selectedData.name)

  const [checked, setChecked] = useState(selectedData.hasHeader)
  const [columnInTable, setColumnInTable] = useState<any[]>([])
  const [dataInTable, setDataInTable] = useState<any[]>([])
  const [rename, setRename] = useState<boolean>(false)
  const [renameValue, setRenameValue] = useState<string>('')
  // for delete modal
  const [open, setOpen] = useState<boolean>(false) 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value)
  }

  const toRename = (oldName: string, newName: string) => {
    const result = handleRename('data', oldName, newName, fileNameStore)
    if (result.status) {
      setFileNameStore(result.newStore as DataFile[])
      setPreview(newName)
    }
    setRename(false)
  }

  const toDelete = (name: string) => {
    const result = handleDelete('data', name, fileNameStore)
    setFileNameStore(result as DataFile[])
    setOpen(false)
    setPreview('')
    setMain('blank')
  }

  const toCopy = (name: string) => {
    const result = handleCopy('data', name, fileNameStore)
    setFileNameStore(result as DataFile[])
  }

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
    marginLeft: 10,
    background: '#979797',
  })


  useEffect(() => {
    if (data && selectedData.name.endsWith('.csv')) {
      const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + selectedData.name) as string)
      const headers = Object.keys(jsonData[0])
      const columns = headers.map(header => {
        return {
          title: header,
          dataIndex: header,
          key: header,
        }
      })
      setColumnInTable(columns)
      const dataintable = jsonData.map((d: any, i: number) => {
        d._rowKey = i
        return d
      })
      setDataInTable(dataintable)
    }
    else {
      message.error('There is no such data file in the storage!')
    }
    
  }, [selectedData])

  const renderPreview = () => {
    if (data && selectedData.name.endsWith('.json')){
      return (
        <div className={classes.json}>
          <code>
            <pre>{JSON.stringify(JSON.parse(data), null, 4)}</pre>
          </code>
        </div>
      )
    }
    else if (data && selectedData.name.endsWith('.csv')) {
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
            size='small'
            pagination={{defaultPageSize: 15}}
          >
          </Table>
        </>
      )
    }
  }

  return (
    <div className='root'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {/* name */}
        <div style={{ display: 'flex', alignItems: 'center'}}>
          {!rename ? 
            <>
              <h2>{selectedData.name}</h2>
              <Button
                icon={<EditFilled />}
                type='text'
                shape='circle'
                onClick={() => setRename(true)}
              />
            </>:<>
              <Input
                style={{ width: 300, fontSize: '22px', margin: '16px 5px', marginLeft: 0}}
                defaultValue={selectedData.name}
                onChange={handleInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  icon={<CheckOutlined />}
                  type='text'
                  shape='circle'
                  onClick={() => toRename(selectedData.name, renameValue)}
                />
                <Button
                  icon={<CloseOutlined />}
                  type='text'
                  shape='circle'
                  onClick={() => setRename(false)}
                />
              </div>
            </>}
        </div>
        {/* func */}
        <div style={{ display: 'flex' }}>
          {/* <MyButton 
            icon={<EditFilled />}
            type='primary'
            disabled
          >
            Edit data
          </MyButton> */}
          <MyButton
            icon={<CopyFilled />}
            type='primary'
            onClick={() => toCopy(selectedData.name)}
          >
            Duplicate
          </MyButton>
          <MyButton
            icon={<DeleteFilled />}
            type='primary'
            onClick={() => setOpen(true)}
          >
            Delete
          </MyButton>
        </div>
        {/* modal for delete data/network */}
        <Modal
          title={`Delete data`}
          open={open}
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="ok"
              type="primary"
              onClick={() => toDelete(selectedData.name)}
            >
              OK
            </Button>
          ]}
        >
          <p>Are you sure you want to delete {selectedData.name} ?</p>
        </Modal>
      </div>

      {renderPreview()}

    </div>
  )
}

export default DataPreview