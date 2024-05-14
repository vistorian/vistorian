import styled from '@emotion/styled';
import { Checkbox, Form, Table, Typography } from 'antd'
const { Title, Text } = Typography;


interface ITablePreviewProps {
  hasHeaderRow: boolean
  setHasHeaderRow: (data: boolean) => void
  columnInTable: any[]
  dataInTable: any[]
}

function TablePreview(props: ITablePreviewProps) {
  const { hasHeaderRow, setHasHeaderRow, columnInTable, dataInTable } = props


  return (
    <>
      <Form.Item name="hasHeaderRow" valuePropName="checked">
        <Checkbox
          checked
          style={{fontWeight: 700, fontSize: 20}}
          onChange={() => setHasHeaderRow(!hasHeaderRow)}
        >
        </Checkbox>
        <span style={{fontSize: 20, fontWeight: 600, marginLeft: 10}}>Does the first row contains column header names?</span>
      </Form.Item>
      <Table
        columns={columnInTable}
        dataSource={dataInTable}
        pagination={false}
        rowKey={(record) => record._rowKey}
        size="small"
      />

    </>
  )
}

const MyTitle = styled(Title)({
  marginTop: 20,
  marginBottom: 20
})

export default TablePreview