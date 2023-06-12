import { createUseStyles } from 'react-jss'
import { Button, Input, message } from 'antd'
import { useState, useContext } from 'react'
import { WizardContext } from '../context';
import { DataFile } from '../../../../typings';

const { TextArea } = Input

const useStyles = createUseStyles({
})

interface IPaste {
  setPreview: (data: DataFile) => void;
  setCurrent: (data: string) => void;
  checkDuplicate: (name: string) => boolean;
}

function Paste(props: IPaste) {
  const classes = useStyles()
  const { setPreview, setCurrent, checkDuplicate } = props
  const { fileNameStore, setFileNameStore } = useContext(WizardContext);

  const [fileName, setFileName] = useState('')
  const [data, setData] = useState('')

  const checkIsJSON = (str: string) => {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  const checkSave = () => {
    if (fileName.length > 0) {
      if (!checkDuplicate(fileName)) {
        if (fileName.endsWith('.json') && checkIsJSON(data)) {
          message.success(`${fileName} file saved successfully.`)
          // console.log('reader.onload:', reader.result)
          window.localStorage.setItem("UPLOADED_FILE_" + fileName, data)
          const tmp: DataFile = {
            name: fileName,
            hasHeader: true
          }
          setFileNameStore([...fileNameStore, tmp])
          setPreview(tmp)
          setCurrent('preview')
        }
        else {
          message.error(`${fileName} file failed to be saved. Please save the data in the JSON format. And the name must end with one of: .json.`)
        }
      }
    }
    else {
      message.error(`Please provide a name for your data and the name must end with one of: .json.`)
    }
  }

  return (
    <div className='root'>
      <TextArea 
        rows={20} 
        allowClear 
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData(e.target.value)}
      />
      <p>
        Save as:
        <Input style={{ width: '20%', marginLeft: 6, marginRight: 10 }} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>setFileName(e.target.value)}
        />
        <Button type='primary' onClick={checkSave}>Save</Button>
      </p>
      <p style={{ 
        paddingTop: 0,
        fontSize: 14,
      }}>
        Note: The data should be in the JSON format. And the name must end with one of: .json.
      </p>
    </div>
  )
}

export default Paste