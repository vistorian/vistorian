import { Checkbox, Select, Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';

const { Title } = Typography

const opts = [
  { value: '', label: '-'},
  { value: 'linkId', label: 'Link id' },
  { value: 'sourceNodeLabel', label: 'Source node label' },
  { value: 'targetNodeLabel', label: 'Target node label' },
  { value: 'locationOfSourceNode', label: 'Location of source node' },
  { value: 'locationOfTargetNode', label: 'Location of target node' },
  { value: 'linkWeight', label: 'Link weight' },
  { value: 'linkType', label: 'Link type' },
  { value: 'time', label: 'Time' },
]
const fullCol = opts.map(o => o.value).filter(i => i !== '')

interface IDataTableProps {
  network: NetworkConfig
  edit: boolean
}

function LinkDataTable(props: IDataTableProps) {
  const { network, edit } = props

  const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + network.linkTableConfig?.file) as string)
  const columns = Object.keys(jsonData[0]).map(item => {
    return {
      title: item,
      dataIndex: item,
      width: `calc(100%/${Object.keys(jsonData[0]).length})`
    }
  })
  const data = jsonData.map((d: any, i: number) => {
    d._rowKey = i
    return d
  })

  const directed = network.linkTableConfig?.directed
  const timeFormat = network.linkTableConfig?.timeFormat


  /**
   * @description map the data column to network config
   * @param {string} dataColumn column name in the data table
   * @return {string} network config, e.g., sourceNodeLable, linkType 
   */
  const getDefault = (dataColumn: string) => {
    if (network.linkTableConfig) {
      const entries = Object.entries(network.linkTableConfig)
      for (let i = 0; i < entries.length; i++){
        const entry = entries[i]
        if (fullCol.findIndex(i => i === entry[0]) > -1 && dataColumn === entry[1]){
          return entry[0]
        }
      }
    }
    return ''
  }

  const handleChange = (value: string, dataColumn: string) => {
    if (value !== '') {
      const tmp = JSON.parse(JSON.stringify(network))
      // @ts-ignore
      tmp.linkTableConfig[value] = dataColumn
    }
  }

  return (
    <>
      <div style={{ display: 'flex'}}>
        <Checkbox />
      </div>
      <div style={{ display: 'flex'}}>
        {columns.map(column => {
          const netColumn = getDefault(column.dataIndex)
          return (
            <Select
              defaultValue={netColumn}
              style={{ width: `calc(100%/${Object.keys(jsonData[0]).length} + 8px)`, margin: 4 }}
              onChange={(value) => handleChange(value, column.dataIndex)}
              options={opts}
              disabled={!edit}
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