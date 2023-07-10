import { Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';
import LinkDataTable from './linkDataTable'
import NodeDataTable from './nodeDataTable'

const { Title } = Typography

interface IDataTableProps {
  network: NetworkConfig
  edit: boolean
}

function DataTable(props: IDataTableProps) {
  const { network, edit } = props 

  return (
    <>
      <Title level={4}>{network.linkTableConfig?.file}</Title>
      <LinkDataTable network={network} edit={edit} />

      {network.extraNodeConfig?.hasExtraNode ? <>
        <Title level={4}>{network.extraNodeConfig?.file}</Title>
        <NodeDataTable network={network} edit={edit} />
      </>: null}
    </>
  )
}

export default DataTable