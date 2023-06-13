import { Table, Typography, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import csvtojson from 'csvtojson'

const { Title } = Typography

const fullCol = {
  linkId: 'Link id',
  // sourceNodeId: 'Source node id',
  sourceNodeLabel: 'Source node label',
  // targetNodeId: 'Target node id',
  targetNodeLabel: 'Target node label',
  locationOfSourceNode: 'Location of source node',
  locationOfTargetNode: 'Location of target node',
  linkWeight: 'Link weight', 
  linkType: 'Link type',
  whetherLinkDirected: 'Link Directed',
  time: 'Time',
}

interface INetworkLinkTableProps {
  network: string
}

function NetworkLinkTable(props: INetworkLinkTableProps) {
  const network = JSON.parse(props.network)

  const [columnInTable, setColumnInTable] = useState<any[]>([])
  const [dataInTable, setDataInTable] = useState<any[]>([])

  const getColumns = () => {
    let columns = [] as ColumnsType
    if (network.format?.format === 'tabular') {
      if (network.linkType?.linkType === 'rowPerLink') {
        Object.entries(fullCol).forEach((entry) => {
          if (network.linkTableConfig.hasOwnProperty(entry[0]) && network.linkTableConfig[entry[0]].length > 0) {
            columns.push({
              title: entry[1],
              children: [{
                  title: network.linkTableConfig[entry[0]],
                  dataIndex: entry[0],
                  key: entry[0],
                }]
            })
          }
        })        
      }
      else { // 'rowPerNode'

      }
    }
    // console.log('getColumns:', columns)
    return columns
  }

  const getData = async () => {
    const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + network.linkTableConfig?.file) as string
    if (csvdata) {
      // TODO: deal with no fakeHeader
      const columns = getColumns()
      await csvtojson().fromString(csvdata)
        .then((jsonData) => {
          const data = jsonData.map((record, index) => {
            let row: { [key: string]: string|number } = {}
            row['_rowKey'] = index
            columns.forEach(column => {
              // @ts-ignore
              let k = column.children[0].dataIndex
              row[k] = record[network.linkTableConfig[k]]
            })
            return row
          })
          // console.log('getData:', data)
          setColumnInTable(columns)
          setDataInTable(data)
        })
    }
    else {
      message.error('There is no such data file in the storage!')
    }
  }

  useEffect(() => {
    getData()
  }, [])


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