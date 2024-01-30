import { Button, Checkbox, Input, Select, Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';
import { useEffect, useState } from 'react';
import TimeFormat from '../steps/timeFormat';

const { Title, Text } = Typography

interface IDataTableProps {
  network: NetworkConfig
  edit: boolean
  setEdit: (e: boolean) => void
  linkDataConfig: Object
  setLinkDataConfig: (o: Object) => void
}

function LinkDataTable(props: IDataTableProps) {
  const { network, edit, setEdit, linkDataConfig, setLinkDataConfig } = props

  // drawing the data table 
  const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + network.linkTableConfig?.file) as string)
  const data = jsonData.map((d: any, i: number) => {
    const dd = {...d}
    dd._rowKey = i
    return dd
  })
  const columns = Object.keys(jsonData[0]).map(item => {
    return {
      title: item,
      dataIndex: item,
      width: `calc(100%/${Object.keys(jsonData[0]).length})`
    }
  })

  // for isDirected option
  const [checked, setChecked] = useState<boolean>(network.linkTableConfig?.directed as boolean)
  const onCheckChange = (e) => {
    setChecked(e.target.checked)
    setLinkDataConfig({ ...linkDataConfig, '_directed': e.target.checked })
    if (!edit) setEdit(true)
  }

  // for timeFormat option
  const [openTimeFormat, setOpenTimeFormat] = useState<boolean>(false)
  const [formatString, setFormatString] = useState<string>(network.linkTableConfig?.withTime ? network.linkTableConfig?.timeFormat as string : '')

  // drawing the select options
  const opts = [
    { value: '', label: '-' },
    { value: 'linkId', label: 'Link id' },
    { value: 'sourceNodeLabel', label: network.linkTableConfig?.directed ? 'Source node id' : 'Node 1 id' },
    { value: 'targetNodeLabel', label: network.linkTableConfig?.directed ? 'Target node id' : 'Node 2 id' },
    { value: 'locationOfSourceNode', label: 'Location of source node' },
    { value: 'locationOfTargetNode', label: 'Location of target node' },
    { value: 'linkWeight', label: 'Link weight' },
    { value: 'linkType', label: 'Link type' },
    { value: 'time', label: 'Time' },
  ]
  const fullCol = opts.map(o => o.value).filter(i => i !== '')


  /**
   * @description map the data column to network config
   * @param {string} dataColumn column name in the data table
   * @return {string} network config, e.g., sourceNodeLable, linkType 
   */
  const getDefault = (dataColumn: string) => {
    if (network.linkTableConfig) {
      for (let entry of Object.entries(network.linkTableConfig)){
        if (fullCol.findIndex(i => i === entry[0]) > -1 && dataColumn === entry[1]){
          return entry[0]
        }
      }
    }
    return ''
  }

  /**
   * @description handle select changes
   * @param {string} value: the changed config option
   * @param {string} dataColumn: dataColumn: column name in the data table
   */
  const handleChange = (value: string, dataColumn: string) => {
    if (!edit) setEdit(true)
    const dataColSet = columns.map(col => {
      if (col.title === dataColumn) {
        return { [col.title]: value }
      }
      else if (Object.keys(linkDataConfig).length === 0) { // have not edited the node data config
        return { [col.title]: getDefault(col.title) }
      }
      else if (linkDataConfig.hasOwnProperty(col.title)) {
        return { [col.title]: linkDataConfig[col.title] }
      }
      else
        return { [col.title]: '' }
    })
    const filtered: any = {} // filter out data columns that are not used in the network
    dataColSet.filter(col => Object.values(col)[0].length > 0).forEach(col => {
      filtered[Object.keys(col)[0]] = Object.values(col)[0]
    })
    setLinkDataConfig({...filtered})
  }

  useEffect(() => {
    if (formatString.length > 0 && formatString !== network.linkTableConfig?.timeFormat) {
      if (!edit) setEdit(true)
      setLinkDataConfig({ ...linkDataConfig, '_timeFormat': formatString })
    }
  }, [formatString])

  return (
    <>
      <div style={{ display: 'flex', marginBottom: 5}}>
        <Checkbox 
          checked={checked}
          onChange={onCheckChange}
        > 
          Is directed?
        </Checkbox>
        {network.linkTableConfig?.withTime ? <>
          <Text style={{ marginLeft: 10, marginRight: 5, fontWeight: 600 }}>Time format:</Text>
          {/* <Input 
            value={formatString}
            size='small' 
            style={{ width: 150, marginRight: 10} } 
            onChange={(e) => setFormatString(e.target.value)}
          /> */}
          <Text underline>{formatString}</Text>
          <Button size='small' 
            style={{ marginLeft: 8}}
            onClick={()=>setOpenTimeFormat(!openTimeFormat)}>
            Edit
          </Button>
          <TimeFormat
            open={openTimeFormat}
            setOpen={setOpenTimeFormat}
            formatString={formatString}
            setFormatString={setFormatString}
          />
        </> : null}
      </div>
      <div style={{ display: 'flex'}}>
        {columns.map(column => {
          const netColumn = getDefault(column.dataIndex)
          return (
            <Select
              key={column.dataIndex}
              defaultValue={netColumn}
              style={{ width: `calc(100%/${Object.keys(jsonData[0]).length} + 8px)`, margin: 4 }}
              onChange={(value) => handleChange(value, column.dataIndex)}
              options={opts}
            />
          )
        })}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        showHeader={true}
        rowKey={(record) => record._rowKey}
        pagination={{ defaultPageSize: 5 }}
        size='small'
      />
    </>
  )
}

export default LinkDataTable