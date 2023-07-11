import { Button, Col, Row, Typography, Radio, Space, Select, RadioChangeEvent, Modal, Spin, message } from 'antd'
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import styled from '@emotion/styled'
import { useContext, useEffect, useRef, useState } from 'react'
import { WizardContext } from '../context'
import NetworkNodeTable from '../network/preview/networkNodeTable'
import NetworkLinkTable from '../network/preview/networkLinkTable'
import { NetworkConfig } from '../../../../typings'

const useStyles = createUseStyles({
})

const { Title, Text } = Typography

interface INetworkSelectorProps {
  setStep: (step: number) => void // update the session creator steps
  selectedNetwork: string 
  setSelectedNetwork: (name: string) => void
  moveToNetwork: (main: string) => void
  isFromNetworkCfg: boolean|undefined
}

function NetworkSelector(props: INetworkSelectorProps) {
  const classes = useStyles()
  const { setStep, selectedNetwork, setSelectedNetwork, moveToNetwork, isFromNetworkCfg } = props  
  const { networkStore } = useContext(WizardContext)

  // true for select an existing one, false for upload a new one
  const [netSource, setNetSource] = useState<boolean | undefined>(typeof(isFromNetworkCfg) === 'undefined' ? undefined: isFromNetworkCfg) 
  // selected network name for preview
  const [network, setNetwork] = useState<string>()
  // when users select to upload a new vis, spin 3 seconds to maintain mental modal
  const [loading, setLoading] = useState<boolean>(false)

  const handleNext = () => {
    // TODO: examine if network has been selected
    if (network && network.length > 0) {
      setStep(1)
      if (network !== selectedNetwork)
        setSelectedNetwork(network)
    }
    else {
      message.error('Please first select a network!')
    }
  }

  const getNetworkList = () => {
    return networkStore.map((n: string) => {
      return {
        label: n,
        value: n
      }
    })
  }

  const onTypeChange = (e: RadioChangeEvent) => {
    setNetSource(e.target.value)
    if (!e.target.value) { // upload a new visualization
      setLoading(true)
      moveToNetwork('network')
      // setTimeout(() => moveToNetwork('network'), 2000) 
    }
  }

  // if back from network config, update 
  useEffect(()=>{
    if (selectedNetwork.length > 0)
      setNetwork(selectedNetwork)
  }, [netSource])
  


  return (
    <>
      <Spin spinning={loading}>
        <Title level={3}>Choose a network to visualize: </Title>

        <MySpace direction='vertical'>
          <Radio.Group onChange={onTypeChange} defaultValue={netSource}>
            <MySpace direction='vertical'>
              <Radio value={'true'}>
                <Text style={{ fontSize: 18, paddingTop: 4, marginRight: 10 }}>
                  Select a previously uploaded network:
                </Text>
                <Select
                  style={{ width: 300 }}
                  options={getNetworkList()}
                  onChange={(value) => { setNetwork(value) }}
                  disabled={!netSource}
                />
              </Radio>
              <Radio value={false}>
                <Text style={{ fontSize: 18, paddingTop: 4, marginRight: 10 }}>
                  Upload a new network
                </Text>
              </Radio>
              <Text style={{ fontSize: 16, paddingTop: 4, color: 'red', marginLeft: 24 }}>
                <InfoCircleOutlined style={{ marginRight: 5 }} />
                "Upload a new network" will redirect you to the steps that upload a new network first and then return back to this page.
              </Text>
            </MySpace>
          </Radio.Group>
        </MySpace>

        {network && network.length > 0 ? (<>
          <Title level={3}>{network} </Title>
          <NetworkNodeTable network={JSON.parse(window.localStorage.getItem('NETWORK_WIZARD_'+network) as string) as NetworkConfig} />
          <NetworkLinkTable network={JSON.parse(window.localStorage.getItem('NETWORK_WIZARD_' + network) as string) as NetworkConfig} />
        </>): null}

        <Row>
          <Col span={8} offset={16} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <MyButton type="primary" onClick={() => handleNext()}>
              Next <RightOutlined />
            </MyButton>
          </Col>
        </Row>
      </Spin>
      
    </>
  )
}

const MyButton = styled(Button)({
  width: 130,
  marginTop: 40,
  marginBottom: 30,
})

const MySpace = styled(Space)({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  textAlign: "left",
})


export default NetworkSelector