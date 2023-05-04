import { createUseStyles } from 'react-jss'
import { useContext } from 'react'
import { Upload, Form, message } from 'antd'
import { RcFile } from 'antd/es/upload';
import { EditorContext } from '../context';

const useStyles = createUseStyles({
})


function UploadFiles() {
  const classes = useStyles()
  const { fileNameStore, setFileNameStore } = useContext(EditorContext);

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
      message.success(`${file.name} file uploaded successfully`)
      // console.log('reader.onload:', reader.result)
      window.localStorage.setItem("UPLOADED_FILE_" + file.name, reader.result as string)
      setFileNameStore([...fileNameStore, file.name])
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
              accept="application/json, text/csv, .tsv, .graphml, .gedcom, .pajek"
            >
              <p className="ant-upload-text">Click or drag files to this area to upload.</p>
              <p className="ant-upload-hint">
                Support for JSON/CSV/TSV files.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
      

    </div>
  )
}

export default UploadFiles