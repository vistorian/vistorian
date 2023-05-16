import { createUseStyles } from 'react-jss'
import { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import styles from './index.module.less'

const useStyles = createUseStyles({
  highlight: {
    backgroundColor: '#fbe7c1',
  }
})

interface ITableItemProps {
  type: string;
}

interface perLinkDataType {
  index: number;
  sourceNode: string;
  relationType: string;
  targetNode: string;
  date: string;
  key: string;
}

interface perNodeDataType {
  node: string;
  mother: string;
  father: string;
  godFather: string;
  godMother: string;
  placeOfBirth: string;
  key: string;
}

function TablePreview(props: ITableItemProps) {
  const classes = useStyles()

  const { type } = props;
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([])
  useEffect(() => {
    if (type === "link") { setData(dataPerLink); setColumns(columnsLink); }
    if (type === "node") { setData(dataPerNode); setColumns(columnsNode); }
  }, [])

  const columnsLink: ColumnsType<perLinkDataType> = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Source Node',
      dataIndex: 'sourceNode',
      key: 'sourceNode',
      className: classes.highlight,
    },
    {
      title: 'Relation Type',
      dataIndex: 'relationType',
      key: 'relationType',
    },
    {
      title: 'Target Node',
      dataIndex: 'targetNode',
      key: 'targetNode',
      className: classes.highlight,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];
  const dataPerLink: perLinkDataType[] = [
    { key: "1", index: 0, sourceNode: "Bob", relationType: "Work", targetNode: "Sarah", date: "03/08/1973" },
    { key: "2", index: 1, sourceNode: "Alex", relationType: "Work", targetNode: "Bob", date: "06/08/1975" },
    { key: "3", index: 2, sourceNode: "Alex", relationType: "Friendship", targetNode: "Bob", date: "03/08/1975" },
    { key: "4", index: 3, sourceNode: "Alex", relationType: "Friendship", targetNode: "Eve", date: "15/09/1971" },
  ];

  const columnsNode: ColumnsType<perNodeDataType> = [
    {
      title: 'Node',
      dataIndex: 'node',
      key: 'node',
      className: classes.highlight,
    },
    {
      title: 'Mother',
      dataIndex: 'mother',
      key: 'mother',
    },
    {
      title: 'Father',
      dataIndex: 'father',
      key: 'father',
    },
    {
      title: 'God Father',
      dataIndex: 'godFather',
      key: 'godFather',
    },
    {
      title: 'God Mother',
      dataIndex: 'godMother',
      key: 'godMother',
    },
    {
      title: 'Place-of-birth',
      dataIndex: 'placeOfBirth',
      key: 'placeOfBirth'
    }
  ];
  const dataPerNode: perNodeDataType[] = [
    { key: "1", node: "Bob", mother: "Celine", father: "Charles", godFather: "Dave", godMother: "Eve", placeOfBirth: "Paris" },
    { key: "2", node: "Ana", mother: "Fannie", father: "Gerd", godFather: "Mike", godMother: "Dianne", placeOfBirth: "London" },
    { key: "3", node: "Celine", mother: "Maria", father: "João", godFather: "Pedro", godMother: "Ana", placeOfBirth: "Lisbon" },
  ]

  return (
    <Table columns={columns} dataSource={data} pagination={false} size={"small"} style={{ width: "100%" }} />
  );
}

export default TablePreview