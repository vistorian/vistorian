import { Table, Typography, message } from 'antd'
import { NetworkConfig } from '../../../../../typings'
import { useEffect } from 'react'

const { Title } = Typography

interface INetworkLinkTableProps {
  network: NetworkConfig
}

function NetworkLinkTable(props: INetworkLinkTableProps) {
  const { network } = props
  // console.log('network link table:', network)

  const fullCol = {
    linkId: 'Link id',
    sourceNodeLabel: 'Source node id',
    targetNodeLabel: 'Target node id',
    // sourceNodeLabel: network.linkTableConfig?.directed ? 'Source node id' : 'Node 1 id',
    // targetNodeLabel: network.linkTableConfig?.directed ? 'Target node id' : 'Node 2 id',
    locationOfSourceNode: 'Location of source node',
    locationOfTargetNode: 'Location of target node',
    linkWeight: 'Link weight',
    linkType: 'Link type',
    time: 'Time',
  }

  // useEffect(() => {
  //   fullCol.sourceNodeLabel = network.linkTableConfig?.directed ? 'Source node id' : 'Node 1 id'
  //   fullCol.targetNodeLabel = network.linkTableConfig?.directed ? 'Target node id' : 'Node 2 id'
  // }, [network])
  
  const getColumns = () => {
    let columns = [] as any[]
    if (network.format?.format === 'tabular') {
      Object.entries(fullCol).forEach((entry) => {
        //@ts-ignore
        if (network.linkTableConfig && network.linkTableConfig.hasOwnProperty(entry[0]) && network.linkTableConfig[entry[0]].length > 0) {
          columns.push({
            title: entry[1],
            //@ts-ignore
            dataIndex: network.linkTableConfig[entry[0]]
          })
        }
      })
    }
    // TODO: test other data formats
    // console.log('getColumns:', columns)
    return columns
  }

  const getData = () => {
    let data: any[] = []
    const jsonData = JSON.parse(window.localStorage.getItem("UPLOADED_FILE_" + network.linkTableConfig?.file) as string)
    // console.log('getData:', jsonData)
    if (jsonData) {
      const columns = getColumns()
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
    else {
      message.error('There is no such data file in the storage!')
    }
    return data
  }

  const columnInTable = getColumns()
  const dataInTable = getData()

  return (
    <>
      <Title level={4}>Link Table</Title>
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

export default NetworkLinkTable