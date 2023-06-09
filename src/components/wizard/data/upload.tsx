import { createUseStyles } from 'react-jss'
import { useContext } from 'react'
import { Upload, Form, message } from 'antd'
import { RcFile } from 'antd/es/upload';
import { WizardContext } from '../context';
import { DataFile } from '../../../../typings';

const useStyles = createUseStyles({
})

interface IUploadFiles {
  setPreview: (data: DataFile) => void;
  setCurrent: (data: string) => void;
  checkDuplicate: (name: string) => boolean;
}

function UploadFiles(props: IUploadFiles) {
  const classes = useStyles()
  const { setPreview, setCurrent, checkDuplicate } = props
  const { fileNameStore, setFileNameStore } = useContext(WizardContext)

  const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  }

  const handleFile = (file: RcFile, fileList: RcFile[]) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onerror = () => {
      message.error(`${file.name} file upload failed.`)
    }
    reader.onload = () => {
      if(!checkDuplicate(file.name)) {
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
      setPreview(tmp)
      setCurrent('preview')
    }
    return false
  }

  return (
    <div className='root'>
      <Form>
        {/* Dragger needs two form.item! */}
        <Form.Item>
          <Form.Item 
            name="dragger" 
            valuePropName="fileList" 
            getValueFromEvent={normFile} 
            noStyle 
          >
            <Upload.Dragger 
              name="file"
              beforeUpload={handleFile}
              showUploadList={false}
              accept="application/json, text/csv, .graphml, .gedcom, .pajek"
            >
              <p className="ant-upload-text">Click or drag files to this area to upload.</p>
              <p className="ant-upload-hint">
                Support for JSON/CSV/Graphml/Gedcom/Pajek files.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
      

    </div>
  )
}

export default UploadFiles