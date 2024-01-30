import { createUseStyles } from 'react-jss'
import { useContext, useState } from 'react';
import { Alert, Button, Input, Modal, Typography } from 'antd';
import { DeleteFilled, CopyFilled, EditFilled, CheckOutlined, CloseOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { WizardContext } from '../context';
import styled from '@emotion/styled';
import { handleCopy, handleDelete, handleRename } from '../utils';
import NetworkNodeTable from './preview/networkNodeTable';
import NetworkLinkTable from './preview/networkLinkTable';
import { ExtraNodeConfig, LinkTableConfig, NetworkConfig } from '../../../../typings';
import LinkDataTable from './preview/linkDataTable';
import NodeDataTable from './preview/nodeDataTable';

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
  // for opening the delete modal
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

  // { [dataColumn]: configValue }
  const [linkDataConfig, setLinkDataConfig] = useState<Object>({})
  const [nodeDataConfig, setNodeDataConfig] = useState<Object>({})

  // if update function succeed or failed
  const [alert, setAlert] = useState<boolean>(false)
  const [alertMsg, setAlertMsg] = useState<string>('')

  // update the network config if there is no conflict
  const updateConfig = () => {
    // console.log('linkDataConfig:', linkDataConfig, 'nodeDataConfig:', nodeDataConfig)
    const linkConfig = {...network.linkTableConfig as LinkTableConfig}
    const nodeConfig = {...network.extraNodeConfig as ExtraNodeConfig}

    // for link table config
    if (linkDataConfig.hasOwnProperty('_directed')) {
      linkConfig.directed = linkDataConfig['_directed']
      delete linkDataConfig['_directed']
    }
    if (linkDataConfig.hasOwnProperty('_timeFormat')) {
      linkConfig.timeFormat = linkDataConfig['_timeFormat']
      delete linkDataConfig['_timeFormat']
    }
    if (Object.keys(linkDataConfig).length > 0) { // linkDataConfig is not empty, i.e., sth. has been changed
      if (Object.values(linkDataConfig).findIndex(ele => ele === 'sourceNodeLabel') === -1 || Object.values(linkDataConfig).find(ele => ele === 'targetNodeLabel') === -1) {
        setAlert(true)
        setAlertMsg('Update failed. You must set both source nodes and target nodes in the link table.')
        return
      }
      if (new Set(Object.values(linkDataConfig)).size !== Object.values(linkDataConfig).length) {
        setAlert(true)
        setAlertMsg('Update failed. You set two data coloumns to the same configuration in the link table.')
        return
      }
    }
    // for node table config
    if (Object.keys(nodeDataConfig).length > 0) {
      if (Object.values(nodeDataConfig).findIndex(ele => ele === 'nodeID') === -1) {
        setAlert(true)
        setAlertMsg('Update failed. You must set the node id in the node table.')
        return
      }
      if (new Set(Object.values(nodeDataConfig)).size !== Object.values(nodeDataConfig).length) {
        setAlert(true)
        setAlertMsg('Update failed. You set two data coloumns to the same configuration in the node table.')
        return
      }
    }

    // successfully update 
    setAlert(false)
    setAlertMsg('')
    setEdit(false)
    const newLinkDataConfig = {}
    Object.keys(linkDataConfig).forEach(k => newLinkDataConfig[linkDataConfig[k]] = k)
    const linkItems = ['sourceNodeLabel', 'targetNodeLabel', 'linkId', 'locationOfSourceNode', 'locationOfTargetNode', 'linkWeight', 'linkType', 'time']
    linkItems.map((item) => {
      if (newLinkDataConfig.hasOwnProperty(item)) {
        linkConfig[item] = newLinkDataConfig[item]
        return
      }
      else if (linkConfig.hasOwnProperty(item)) {
        delete linkConfig[item]
        return
      }
    })

    if (Object.keys(nodeDataConfig).length > 0) {
      const newNodeDataConfig = {}
      Object.keys(nodeDataConfig).forEach(k => newNodeDataConfig[nodeDataConfig[k]] = k)
      console.log(newNodeDataConfig)
      nodeConfig['nodeID'] = newNodeDataConfig['nodeID']
      if (newNodeDataConfig.hasOwnProperty('nodeLabel')) 
        nodeConfig['nodeLabel'] = newNodeDataConfig['nodeLabel']
      else delete nodeConfig['nodeLabel']
      const tmp: string[] = []
      const items = ['type0', 'type1', 'type2']
      items.forEach((item) => {
        if (newNodeDataConfig.hasOwnProperty(item)) tmp.push(newNodeDataConfig[item])
      })
      nodeConfig['nodeTypes'] = tmp
    }
    window.localStorage.setItem("NETWORK_WIZARD_" + selectedNetwork, JSON.stringify({ ...network, linkTableConfig: linkConfig, extraNodeConfig: nodeConfig }))
  }

  return (
    <div className='root'>
      {/* title */}
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
      
      <Title level={4}>{network.linkTableConfig?.file}</Title>
      <LinkDataTable 
        network={network} 
        edit={edit} 
        setEdit={setEdit}
        linkDataConfig={linkDataConfig}
        setLinkDataConfig={setLinkDataConfig}
      />

      {network.extraNodeConfig?.hasExtraNode ? 
      <>
        <Title level={4}>{network.extraNodeConfig?.file}</Title>
        <NodeDataTable 
          network={network} 
          edit={edit} 
          setEdit={setEdit}
          nodeDataConfig={nodeDataConfig}
          setNodeDataConfig={setNodeDataConfig}
        />
      </> : null}
      


      <Title level={3}> PREVIEW </Title>
      {edit ? <>
        <span>You are editing your network configuration. Click the update button to update the tables when you finished the configuration. </span>
        <br />
        <Button 
          style={{ margin: '10px 0px' }} 
          type='primary'
          onClick={updateConfig}
          >
            Update
        </Button>
        {alert ? <Alert
          message={alertMsg}
          type="error"
          showIcon
          closable
        /> : null}
      </> : <>
        <span>Below, you see the link and node tables that are generated from your specified network.</span>
        <NetworkNodeTable network={network} />
        <NetworkLinkTable network={network} />
      </>}
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