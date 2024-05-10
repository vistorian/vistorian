import { Button, Input, Tooltip } from 'antd'
import { DeleteFilled, CopyFilled, EditFilled, CheckOutlined, CloseOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import { OperationType } from '../../../typings'
import { useState } from 'react'
import { defaultDatasets, defaultNetworks } from '../../../typings/constant'

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
    },
    paddingLeft: '10px',
  },
  tabNameFocused: {
    width: 170,
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: '#FFDF70',
    '&:hover': {
      cursor: 'pointer'
    },
    paddingLeft: '10px',
    borderRadius: '5px'
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
  showVisSelector: (name: string) => void
}

function Record(props: IRecordProps) {
  const classes = useStyles()
  const { data, type, selectedPreview, toCopy, toRename, handleSelectToDelete, showPreview, showVisSelector } = props

  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>(data)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const isDefault = type === 'network' ? defaultNetworks.has(data) : defaultDatasets.has(data)

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
            <Tooltip title={isDefault ? `You cannot rename the default ${type}. Duplicate a new one first.`: 'Rename'}>
              <Button
                disabled={isDefault}
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
            <Tooltip title={isDefault ? `You cannot delete the default ${type}.` : 'Delete'}>
              <Button
                disabled={isDefault}
                icon={<DeleteFilled />}
                type='text'
                shape='circle'
                onClick={() => handleSelectToDelete(type, data)}
              />
            </Tooltip>
            {type === 'network' ? 
              <Tooltip title="Visualize">
                <Button
                  type='text'
                  shape='circle'
                  style={{
                    fontWeight: 'bold',
                    color: '#E17918'
                  }}
                  onClick={() => showVisSelector(data)}
                >Vis</Button>
              </Tooltip> : null}
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