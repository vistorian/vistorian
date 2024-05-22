import { createUseStyles } from 'react-jss'
import { useEffect, useContext, useState } from 'react'
import { Form, Upload, message, Select, Typography, FormInstance, Checkbox } from 'antd'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import { findIndex } from 'lodash-es'
import csvtojson from 'csvtojson'

import { WizardContext } from '../../context'
const { Text } = Typography;

const useStyles = createUseStyles({
  upload: {
    backgroundColor: '#eee',
    borderStyle: 'none',
    padding: '10px 20px 20px',
    borderRadius: 10,
    marginBottom: '1em',
  }
})

interface OptionType {
  value: string,
  label: string
}

interface IFileSelectorProps {
  setDataInTable: (data: any[]) => void
  setColumnInTable: (data: any[]) => void
  hasHeaderRow: boolean
  setHasHeaderRow: (data: boolean) => void
  setSelectionOptions: (data: OptionType[]) => void
  selectedFileName: string
  setSelectedFileName: (data: string) => void
  form: FormInstance
}


function FileSelector(props: IFileSelectorProps) {
  const classes = useStyles()
  const { setDataInTable, setColumnInTable, hasHeaderRow, setHasHeaderRow, selectedFileName, setSelectedFileName, setSelectionOptions, form } = props
  const { fileNameStore, setFileNameStore } = useContext(WizardContext);

  const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };


  const handleOnChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const { file } = info
    // console.log('before:', info.file)
    if (file.status === 'done') {
      // console.log('done:', info.file)
      setSelectedFileName(file.name)
      form.setFieldsValue({ 'file': file.name })
    }
  }

  // @ts-ignore
  const customRequest = (options: UploadRequestOption<any>) => {
    const { onSuccess, onError, file } = options
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onerror = () => {
      message.error(`${file.name} file upload failed.`)
    }
    reader.onload = async () => {
      if (fileNameStore.indexOf(selectedFileName) > -1) {
        message.error(`${file.name} file upload failed, as the system does not allow data files uploaded with the same name. Please select a previously uploaded file.`)
        return false
      }
      message.success(`${file.name} file uploaded successfully.`)
      const csvdata = reader.result as string
      await csvtojson({ noheader: true}).fromString(csvdata).then((jsonData) => {
        window.localStorage.setItem("UPLOADED_FILE_" + file.name, JSON.stringify(jsonData))
      })
      onSuccess(null, file)
    }
    return true
  }

  const getSelectionFileList = () => {
    return fileNameStore.map((fn) => {
      return {
        label: fn,
        value: fn
      }
    })
  }

  const formatJsonForTable = (fileName: string) => {
    const data = window.localStorage.getItem("UPLOADED_FILE_" + fileName)
    if (data) {
      let jsonData: any[] = JSON.parse(data as string)
      let headers: string[] = []
      if (hasHeaderRow) {
        let tmpData: any[] = []
        for (let i = 1; i < jsonData.length; i++){
          let item: any = {}
          Object.entries(jsonData[0]).forEach((entry) => {
            // @ts-ignore
            item[entry[1]] = jsonData[i][entry[0]]
          })
          tmpData.push(item)
        }
        jsonData = tmpData
        headers = Object.keys(jsonData[0])
      }
      else {
        headers = Object.keys(jsonData[0])
      }
      const columns = headers.map(header => {
        return {
          title: header,
          dataIndex: header,
          key: header,
        }
      })
      let options = [{ value: '', label: '-' }]
      headers.map((header: string) => {
        options.push({
          value: header,
          // @ts-ignore
          label: `${header} (First value is ${jsonData[0][header]})`,
        })
      })
      setColumnInTable(columns)
      // only preview 3 rows
      const dataintable = jsonData.slice(0, 3).map((d: any, i: number) => {
        d._rowKey = i
        return d
      })
      setDataInTable(dataintable)
      setSelectionOptions(options)
    }
    else {
      message.error('There is no such data file in the storage!')
    }
  }

  useEffect(()=>{
    if (selectedFileName.length > 0) {
      formatJsonForTable(selectedFileName)
    }
  }, [selectedFileName, hasHeaderRow])

  return (
    <>
      <div className={classes.upload}>
        <Form.Item 
          name="file"
          style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex' }}>
            <Text style={{ width: 300, fontSize: 16, paddingTop: 4 }}>Select a previously uploaded file</Text>
            <Select
              style={{ width: 300 }}
              options={getSelectionFileList()}
              onChange={(value) => {
                setSelectedFileName(value)
                form.setFieldsValue({ 'file': value })
              }}
            />
          </div>
        </Form.Item>
        <Text style={{ fontSize: 16 }}>Or</Text>
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
          rules={[{ required: false, message: 'This is optional.' }]}
        >
          <Upload.Dragger
            // beforeUpload={beforeUpload}
            customRequest={customRequest}
            onChange={handleOnChange}
            showUploadList={false}
            accept="text/csv"
          >
            <p className="ant-upload-text">Click or drag files to this area to upload.</p>
            <p className="ant-upload-hint">
              Support for CSV files.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </div>
      {selectedFileName.length > 0 && fileNameStore.indexOf(selectedFileName) === -1 ? 
        <Form.Item name="hasHeaderRow" valuePropName="checked">
          <Checkbox
            checked={hasHeaderRow}
            style={{ fontWeight: 700, fontSize: 20 }}
            onChange={() => setHasHeaderRow(!hasHeaderRow)}
          >
          </Checkbox>
          <span style={{ fontSize: 20, fontWeight: 600, marginLeft: 10 }}>Does the first row contains column header names?</span>
        </Form.Item> : null}
    </>
  )

}
export default FileSelector