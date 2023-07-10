import React from 'react'
import { Table, Typography } from 'antd'
import { NetworkConfig } from '../../../../../typings';

const { Title } = Typography

interface IDataTableProps {
  network: NetworkConfig
  edit: boolean
}

function NodeDataTable(props: IDataTableProps) {
  const { network, edit } = props 
  
  return (
    <>
      
    </>
  )
}

export default NodeDataTable