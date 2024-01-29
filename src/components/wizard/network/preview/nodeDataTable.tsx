import { Select, Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';

const { Title } = Typography

const opts = [
  { value: '', label: '-' },
  { value: 'nodeID', label: 'Node id' },
  { value: 'nodeLabel', label: 'Node label' },
  { value: 'type0', label: 'Type 1' },
  { value: 'type1', label: 'Type 2' },
  { value: 'type2', label: 'Type 3' },
]

interface IDataTableProps {
  network: NetworkConfig
  edit: boolean
  setEdit: (e: boolean) => void
}

function NodeDataTable(props: IDataTableProps) {
  const { network, edit, setEdit } = props 

  const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + network.extraNodeConfig?.file) as string)
  const columns = Object.keys(jsonData[0]).map(item => {
    return {
      title: item,
      dataIndex: item,
      width: `calc(100%/${Object.keys(jsonData[0]).length})`
    }
  })
  const data = jsonData.map((d: any, i: number) => {
    const dd = { ...d }
    dd._rowKey = i
    return dd
  })

  /**
  * @description map the data column to network config
  * @param {string} dataColumn column name in the data table
  * @return {string} network config, e.g., sourceNodeLable, linkType 
  */
  const getDefault = (dataColumn: string) => {
    if (network.extraNodeConfig) {
      for (let entry of Object.entries(network.extraNodeConfig)) {
        if (entry[1] === dataColumn) {
          return entry[0] // nodeID or nodeLabel
        }
        else if (entry[0] === 'nodeTypes') {
          // @ts-ignore
          const idx = entry[1].findIndex(i => i === dataColumn)
          if (idx > -1) {
            return `type${idx}`
          }
        }
      }
    }
    return ''
  }
  
  return (
    <>
      <div style={{ display: 'flex' }}>
        {columns.map(column => {
          const netColumn = getDefault(column.dataIndex)
          return (
            <Select
              key={column.dataIndex}
              defaultValue={netColumn}
              style={{ width: `calc(100%/${Object.keys(jsonData[0]).length} + 8px)`, margin: 4 }}
              // onChange={(value) => handleChange(value, column.dataIndex)}
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

export default NodeDataTable