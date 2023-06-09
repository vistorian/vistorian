import { createUseStyles } from 'react-jss'
import { useContext, useState } from 'react';
import { Button, Input, Modal, Typography } from 'antd';
import { DeleteFilled, CopyFilled, EditFilled, CheckOutlined, CloseOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { WizardContext } from '../context';
import styled from '@emotion/styled';
import { handleCopy, handleDelete, handleRename } from '../utils';
import NetworkNodeTable from './preview/networkNodeTable';
import NetworkLinkTable from './preview/networkLinkTable';
import DataTable from './preview/dataTable';
import { NetworkConfig } from '../../../../typings';

const { Title } = Typography

const useStyles = createUseStyles({
})

interface INetworkPreviewProps {
  selectedNetwork: string // the value passed into this sub comp. is preview in its parent comp.
  setPreview: (data: string) => void
  setMain: (data: string) => void
  setSelectedNetwork: (data: string) => void // the func. here is the setSelectedNetwork in its parent comp.
}

function NetworkPreview(props: INetworkPreviewProps) {
  const classes = useStyles()
  const { selectedNetwork, setPreview, setMain, setSelectedNetwork } = props
  const { networkStore, setNetworkStore } = useContext(WizardContext)

  const network = JSON.parse(window.localStorage.getItem("NETWORK_WIZARD_" + selectedNetwork) as string) as NetworkConfig
  const [edit, setEdit] = useState<boolean>(false)

  const [rename, setRename] = useState<boolean>(false)
  const [renameValue, setRenameValue] = useState<string>('')
  // for delete modal
  const [open, setOpen] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value)
  }

  const toRename = (oldName: string, newName: string) => {
    const result = handleRename('network', oldName, newName, networkStore)
    if (result.status) {
      setNetworkStore(result.newStore as string[])
      setPreview(newName)
    }
    setRename(false)
  }

  const toDelete = (name: string) => {
    const result = handleDelete('network', name, networkStore)
    setNetworkStore(result as string[])
    setOpen(false)
    setPreview('')
    setMain('blank')
  }

  const toCopy = (name: string) => {
    const result = handleCopy('network', name, networkStore)
    setNetworkStore(result as string[])
  }

  return (
    <div className='root'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* name */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!rename ?
            <>
              <h2>{selectedNetwork}</h2>
              <Button
                icon={<EditFilled />}
                type='text'
                shape='circle'
                onClick={() => setRename(true)}
              />
            </> : <>
              <Input
                style={{ width: 300, fontSize: '22px', margin: '16px 5px', marginLeft: 0 }}
                defaultValue={selectedNetwork}
                onChange={handleInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  icon={<CheckOutlined />}
                  type='text'
                  shape='circle'
                  onClick={() => toRename(selectedNetwork, renameValue)}
                />
                <Button
                  icon={<CloseOutlined />}
                  type='text'
                  shape='circle'
                  onClick={() => setRename(false)}
                />
              </div>
            </>}
        </div>
        {/* func */}
        <div style={{ display: 'flex' }}>
          {/* <MyButton
            style={{ width: 135 }}
            icon={edit ? <CheckOutlined />: <EditFilled />}
            type='primary'
            onClick={() => setEdit(!edit)}
          >
            {edit? 'Update' : 'Edit Network'}
          </MyButton> */}
          <MyButton
            icon={<CopyFilled />}
            type='primary'
            onClick={() => toCopy(selectedNetwork)}
          >
            Duplicate
          </MyButton>
          <MyButton
            icon={<DeleteFilled />}
            type='primary'
            onClick={() => setOpen(true)}
          >
            Delete
          </MyButton>
          <MyButtonPrimary
            icon={<NodeIndexOutlined />}
            type='primary'
            onClick={() => {
              setMain('visSelector')
              setSelectedNetwork(selectedNetwork)
            }}
          >
            Visualize
          </MyButtonPrimary>
        </div>
        {/* modal for delete data/network */}
        <Modal
          title={`Delete network`}
          open={open}
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="ok"
              type="primary"
              onClick={() => toDelete(selectedNetwork)}
            >
              OK
            </Button>
          ]}
        >
          <p>Are you sure you want to delete {selectedNetwork} ?</p>
        </Modal>
      </div>

      {/* <pre>{JSON.stringify(JSON.parse(data as string), null, 2)}</pre> */}
      {/* data: network configruation */}
      <Title level={3}>DATA TABLE(S)</Title>
      <span>Below, you see the data tables you have used to specify. </span>
      <DataTable network={network} edit={edit}/>


      <Title level={3}> PREVIEW </Title>
      <span>{edit ? "Your link and node tables are updating." : "Below, you see the link and node tables that are generated from your specified network."}</span>
      <NetworkNodeTable network={network} />
      <NetworkLinkTable network={network} />
    </div>
  )
}

const MyButton = styled(Button)({
  marginLeft: 10,
  background: '#979797',
})
const MyButtonPrimary = styled(Button)({
  marginLeft: 10,
  background: '#ED4040',
})

export default NetworkPreview