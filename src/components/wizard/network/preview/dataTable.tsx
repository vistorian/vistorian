import { Table, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import csvtojson from 'csvtojson';
import { NetworkConfig } from '../../../../../typings';
import { ColumnsType } from 'antd/es/table';
import { union } from 'lodash-es';

const { Title } = Typography

interface IDataTableProps {
  dataNames: string[]
}

function DataTable(props: IDataTableProps) {
  const { dataNames } = props 
  const [data, setData] = useState<any[]>()

  const getData = async () => {
    await dataNames.forEach(name => {
      const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + name) as string
      if (csvdata) {
        // TODO: deal with no fakeHeader
        let columns: any[] = []
        let dataintable: any[] = []
        csvtojson().fromString(csvdata)
          .then((jsonData) => {
            const headers = Object.keys(jsonData[0])
            columns = headers.map(header => {
              return {
                title: header,
                dataIndex: header,
                key: header,
              }
            })
            dataintable = jsonData.map((d, i) => {
              d._rowKey = i
              return d
            })
          })
        const result = {
          columns: columns,
          data: dataintable
        }
        
      }
      else {
        message.error('There is no such data file in the storage!')
        return
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Title level={3}>{`DATA TABLE(S)`}</Title>
      <span>Below, you see the data tables you have used to specify ... </span>

      {data && data.map((item, index) => {
        if (item) {
          console.log('render',item.columns)
          return (
            <>
              <Title level={4}>{dataNames[index]}</Title>
              <Table
                key={index}
                columns={item.columns}
                dataSource={item.dataintable}
                showHeader={true}
                rowKey={(record) => record._rowKey}
                size='small'
              />
            </>
          )
        }
      })}
    </>
  )
}

export default DataTable