import { Checkbox, Form, Table } from 'antd'


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
          onChange={() => setHasHeaderRow(!hasHeaderRow)}
        >
          Has header row?
        </Checkbox>
      </Form.Item>
      <Table
        columns={columnInTable}
        dataSource={dataInTable}
        pagination={false}
        rowKey={(record) => record._rowKey}
      />

    </>
  )
}

export default TablePreview