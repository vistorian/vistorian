import { Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';
import { union } from 'lodash-es';

const { Title } = Typography

interface INetworkNodeTableProps {
  network: NetworkConfig
}

function NetworkNodeTable(props: INetworkNodeTableProps) {
  const { network } = props 

  const getColumns = () => {
    let columns: any[] = []
    if (network.format?.format === 'tabular') {
      if (network.extraNodeConfig?.hasExtraNode) { // has extra node table
        columns.push({ title: 'ID', dataIndex: network.extraNodeConfig.nodeID })
        if (network.extraNodeConfig.nodeLabel) {
          columns.push({ title: 'Label', dataIndex: network.extraNodeConfig.nodeLabel })
        }
        const types = network.extraNodeConfig.nodeTypes
        if (types) {
          types.map((type, idx) => {
            if (type && type.length > 0) {
              columns.push({
                title: `Type ${idx+1}`,
                dataIndex: type
              })
            }
          })
        }
      }
      else { // no extra node table
        columns.push(
          { title: 'ID', dataIndex: 'nodeID' }, 
          { title: 'Label', dataIndex: 'nodeLabel'})
      }
    }
    return columns
  }

  const getData = () => {
    const columns = getColumns()
    let data: any[] = []
    if (!network.extraNodeConfig?.hasExtraNode) { // no exra node table
      const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + network.linkTableConfig?.file) as string)
      const sourceNodeLabel = network.linkTableConfig?.sourceNodeLabel
      const targetNodeLabel = network.linkTableConfig?.targetNodeLabel
      if (sourceNodeLabel && targetNodeLabel) {
        data = union(jsonData.map((d: any) => d[sourceNodeLabel]), jsonData.map((d: any) => d[targetNodeLabel])).map((l, i) => ({ '_rowKey': i, 'nodeID': i, 'nodeLabel': l }))
      }
    }
    else { // has extra node table
      const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + network.extraNodeConfig?.file) as string)
      data = jsonData.map((record: any, index: number) => {
        let row: { [key: string]: string | number } = {}
        row['_rowKey'] = index
        columns.forEach(column => {
          let k = column.dataIndex
          row[k] = record[k]
        })
        return row
      })
      // console.log('getData:', data)
    }
    return data
  }

  const columnInTable = getColumns()
  const dataInTable = getData()

  return (
    <>
      <Title level={4}>Node Table</Title>
      <Table
        columns={columnInTable}
        dataSource={dataInTable}
        showHeader={true}
        rowKey={(record) => record._rowKey}
        size='small'
      />
    </>
  )
}

export default NetworkNodeTable