import { Checkbox, Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';

const { Title } = Typography

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

  return (
    <>
      <div style={{ display: 'flex'}}>
        <Checkbox />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        showHeader={true}
        rowKey={(record) => record._rowKey}
        size='small'
      />
    </>
  )
}

export default LinkDataTable