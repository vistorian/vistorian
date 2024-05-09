import { Button, Checkbox, ConfigProvider, Input, Select, Table, Typography } from 'antd'
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
  isDefault: boolean
}

function LinkDataTable(props: IDataTableProps) {
  const { network, edit, setEdit, linkDataConfig, setLinkDataConfig, isDefault } = props
  // console.log('network:', network)

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
    { value: 'sourceNodeLabel', label: 'Source node id' },
    { value: 'targetNodeLabel', label: 'Target node id' },
    // { value: 'sourceNodeLabel', label: checked ? 'Source node id' : 'Node 1 id' },
    // { value: 'targetNodeLabel', label: checked ? 'Target node id' : 'Node 2 id' },
    { value: 'locationOfSourceNode', label: 'Location of source node' },
    { value: 'locationOfTargetNode', label: 'Location of target node' },
    { value: 'linkWeight', label: 'Link weight' },
    { value: 'linkType', label: 'Link type' },
    { value: 'time', label: 'Time' },
  ]
  const fullCol = opts.map(o => o.value).filter(i => i !== '')

  // useEffect(() => {
  //   opts[2].label = checked ? 'Source node id' : 'Node 1 id'
  //   opts[3].label = checked ? 'Target node id' : 'Node 2 id'
  // }, [checked])


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
  const [dataColToNetwork, setDataColToNetwork] = useState<string[]>(columns.map((column) => getDefault(column.dataIndex)))
  // console.log('dataColToNetwork', dataColToNetwork)


  /**
   * @description handle select changes
   * @param {string} value the changed config option
   * @param {string} dataColumn dataColumn: column name in the data table
   * @param {number} index index in networkConfig
   */
  const handleChange = (value: string, dataColumn: string, index: number) => {
    if (!edit) setEdit(true)
    const tmp = [...dataColToNetwork]
    tmp[index] = value
    setDataColToNetwork(tmp)

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

  useEffect(() => {
    setChecked(network.linkTableConfig?.directed as boolean)
    setFormatString(network.linkTableConfig?.withTime ? network.linkTableConfig?.timeFormat as string : '')
    setDataColToNetwork(columns.map((column) => getDefault(column.dataIndex)))
    console.log(dataColToNetwork)
  }, [network.name?.name])

  return (
    <ConfigProvider theme={{ token: { colorTextDisabled: 'rgba(0, 0, 0, 0.75)' } }}>
      <div style={{ display: 'flex', marginBottom: 5}}>
        <Checkbox 
          disabled={isDefault}
          checked={checked}
          onChange={onCheckChange}
        > 
          Is directed?
        </Checkbox>
        {network.linkTableConfig?.withTime ? <>
          <Text style={{ marginLeft: 10, marginRight: 5, fontWeight: 600 }}>Time format:</Text>
          <Text underline>{formatString}</Text>
          {isDefault ? null : 
            <Button size='small'
              style={{ marginLeft: 8 }}
              onClick={() => setOpenTimeFormat(!openTimeFormat)}>
              Edit
            </Button>
          }
          <TimeFormat
            open={openTimeFormat}
            setOpen={setOpenTimeFormat}
            formatString={formatString}
            setFormatString={setFormatString}
          />
        </> : null}
      </div>
      <div style={{ display: 'flex'}}>
        {columns.map((column, idx) => {
          return (
            <Select
              disabled={isDefault}
              key={column.dataIndex}
              value={dataColToNetwork[idx]}
              style={{ width: `calc(100%/${Object.keys(jsonData[0]).length} + 8px)`, margin: 2 }}
              onChange={(value) => handleChange(value, column.dataIndex, idx)}
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
    </ConfigProvider>
  )
}

export default LinkDataTable