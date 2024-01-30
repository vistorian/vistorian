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
  nodeDataConfig: Object
  setNodeDataConfig: (o: Object) => void
}

function NodeDataTable(props: IDataTableProps) {
  const { network, edit, setEdit, nodeDataConfig, setNodeDataConfig } = props 

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
  

  /**
   * @description get the current config: if the selection has not been changed, use default from network config; else get from the nodeDataConfig
   * @param {string} dataColumn column name in the data table
   * @return {string} network config, e.g., sourceNodeLable, linkType 
   */
  // const getChanged = (dataColumn: string) => {
  //   nodeDataConfig[columns.title] 
  // }

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
      else if (Object.keys(nodeDataConfig).length === 0) { // have not edited the node data config
        return { [col.title]: getDefault(col.title) }
      }
      else if (nodeDataConfig.hasOwnProperty(col.title)) {
        return { [col.title]: nodeDataConfig[col.title] }
      }
      else 
        return { [col.title]: '' }
    })
    const filtered: any = {} // filter out data columns that are not used in the network
    dataColSet.filter(col => Object.values(col)[0].length > 0).forEach(col => {
      filtered[Object.keys(col)[0]] = Object.values(col)[0]
    })
    setNodeDataConfig({...filtered })
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

export default NodeDataTable