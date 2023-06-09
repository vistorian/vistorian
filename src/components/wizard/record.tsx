import { Button, Input, Tooltip } from 'antd'
import { DeleteFilled, CopyFilled, EditFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import { OperationType } from '../../../typings'
import { useState } from 'react'

const useStyles = createUseStyles({
  tabContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    lineHeight: "2em",
  },
  tabName: {
    width: 170,
    overflow: "hidden",
    textOverflow: "ellipsis", 
    '&:hover': {
      cursor: 'pointer'
    }
  },
  tabNameFocused: {
    width: 170,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: 700,
    backgroundColor: '#FFDF70',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  tabFunc: {
    display: "flex",
  }
})

interface IRecordProps {
  data: string
  type: OperationType
  selectedPreview: string 
  handleSelectToDelete: (type: OperationType, name: string) => void
  toCopy: (type: OperationType, name: string) => void
  toRename: (type: OperationType, oldName: string, newName: string) => boolean
  showPreview: (type: OperationType, name: string) => void
}

function Record(props: IRecordProps) {
  const classes = useStyles()
  const { data, type, selectedPreview, toCopy, toRename, handleSelectToDelete, showPreview } = props

  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>(data)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className={classes.tabContent} key={data}>
      {!editOpen ? (
        <>
          <Tooltip placement="topLeft" title={data}>
            <span 
              className={selectedPreview === `${type}Preview-${data}` ? classes.tabNameFocused : classes.tabName}
              onClick={() => showPreview(type, data)}
            >
              {data}
            </span>
          </Tooltip>
          <div className={classes.tabFunc}>
            <Tooltip title="Rename">
              <Button
                icon={<EditFilled />}
                type='text'
                shape='circle'
                onClick={() => setEditOpen(true)}
              />
            </Tooltip>
            <Tooltip title="Duplicate">
              <Button
                icon={<CopyFilled />}
                type='text'
                shape='circle'
                onClick={() => toCopy(type, data)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                icon={<DeleteFilled />}
                type='text'
                shape='circle'
                onClick={() => handleSelectToDelete(type, data)}
              />
            </Tooltip>
          </div>
        </>
      ) : (
        <>
          <Input 
            className={classes.tabName}
            defaultValue={data}
            onChange={handleInputChange}
          />
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button 
                icon={<CheckOutlined />}
              type='text'
              shape='circle'
              onClick={()=>{
                if (toRename(type, data, value)) {
                  setEditOpen(false)
                }
              }}
            />
            <Button
              icon={<CloseOutlined />}
              type='text'
              shape='circle'
              onClick={() => setEditOpen(false)}
            />
          </div>
        </>
      )}
      
    </div>
  )
}

export default Record