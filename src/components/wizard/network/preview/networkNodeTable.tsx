import { Table, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import csvtojson from 'csvtojson';
import { NetworkConfig } from '../../../../../typings';
import { ColumnsType } from 'antd/es/table';
import { union } from 'lodash-es';

const { Title } = Typography

interface INetworkNodeTableProps {
  network: string
}

function NetworkNodeTable(props: INetworkNodeTableProps) {
  const network = JSON.parse(props.network) as NetworkConfig
  
  const [columnInTable, setColumnInTable] = useState<any[]>([])
  const [dataInTable, setDataInTable] = useState<any[]>([])

  const getColumns = () => {
    let columns = [] as ColumnsType
    if (network.format?.format === 'tabular') {
      columns = ['id', 'label'].map(header => {
        return {
          title: header,
          dataIndex: header,
          key: header,
        }
    })
    }
    return columns
  }

  const getData = async () => {
    const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + network.linkTableConfig?.file) as string
    if (csvdata) {
      // TODO: deal with no fakeHeader
      const columns = getColumns()
      await csvtojson().fromString(csvdata)
        .then((jsonData) => {
          if (columns.length === 2) { // only has ['id', 'label']
            const sourceNodeLabel = network.linkTableConfig?.sourceNodeLabel
            const targetNodeLabel = network.linkTableConfig?.targetNodeLabel
            if (sourceNodeLabel && targetNodeLabel) {
              const data = union(jsonData.map(d => d[sourceNodeLabel]), jsonData.map(d => d[targetNodeLabel])).map((l, i) => ({ '_rowKey': i, 'id': i, 'label': l }))
              setColumnInTable(columns)
              setDataInTable(data)
            }
          }
        })
    }
    else {
      message.error('There is no such data file in the storage!')
    }
  }

  useEffect(()=>{
    getData()
  }, [])

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