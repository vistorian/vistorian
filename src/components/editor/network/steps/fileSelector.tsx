import { createUseStyles } from 'react-jss'
import { useEffect, useContext } from 'react';
import { Form, Upload, message, Select, Typography, FormInstance } from 'antd';
import { RcFile } from 'antd/es/upload';
import { DataFile } from '../../../../../typings';
import { findIndex } from 'lodash-es';
import csvtojson from 'csvtojson';

import { EditorContext } from '../../context'
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
  setSelectionOptions: (data: OptionType[]) => void
  selectedFileName: string
  setSelectedFileName: (data: string) => void
  form: FormInstance
}


function FileSelector(props: IFileSelectorProps) {
  const classes = useStyles()
  const { setDataInTable, setColumnInTable, hasHeaderRow,  selectedFileName, setSelectedFileName, setSelectionOptions, form } = props
  const { fileNameStore, setFileNameStore } = useContext(EditorContext);

  const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFile = (file: RcFile, fileList: RcFile[]) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onerror = () => {
      message.error(`${file.name} file upload failed.`)
    }
    reader.onload = () => {
      if (findIndex(fileNameStore, (fn: DataFile) => fn.name === file.name) > -1) {
        message.error(`${file.name} file upload failed, as the system does not allow data files uploaded with the same name. You select a previously uploaded file.`)
        return false
      }
      message.success(`${file.name} file uploaded successfully.`)
      // console.log('reader.onload:', reader.result)
      window.localStorage.setItem("UPLOADED_FILE_" + file.name, reader.result as string)
      const tmp: DataFile = {
        name: file.name,
        hasHeader: true
      }
      setFileNameStore([...fileNameStore, tmp])
      setSelectedFileName(file.name)
    }
    return false
  }

  const getSelectionFileList = () => {
    return fileNameStore.map((fn: DataFile) => {
      return {
        label: fn.name,
        value: fn.name
      }
    })
  }

  const convertCsvToJson = async (csvData: string): Promise<any[]> => {
    const jsonArray = await csvtojson().fromString(csvData)
    return jsonArray
  }

  useEffect(() => {
    if (selectedFileName.length > 0) {
      const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + selectedFileName)
      if (csvdata) {
        // TODO: deal with no fakeHeader
        convertCsvToJson(csvdata)
          .then((jsonData) => {
            const headers = Object.keys(jsonData[0])
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
            // only preview 5 rows
            const dataintable = jsonData.slice(0, 5).map((d, i) => {
              d._rowKey = i
              return d
            })
            setDataInTable(dataintable)
            setSelectionOptions(options)
          })
          .catch((error) => {
            message.error('Error during CSV to JSON conversion:');
          })
      }
      else {
        message.error('There is no such data file in the storage!')
      }
    }
  }, [selectedFileName, hasHeaderRow])

  return (
    <>
      <Form.Item
        name="file"
        rules={[{ required: false, message: 'This is optional.' }]}
      >
        <div className={classes.upload}>
          {/* Dragger needs two form.item! */}
          <Form.Item style={{ marginBottom: 0 }}>
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
          >
            <Upload.Dragger
              beforeUpload={handleFile}
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
      </Form.Item>
    </>
  )

}
export default FileSelector