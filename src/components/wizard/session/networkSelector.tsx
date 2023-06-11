import { Button, Col, Row, Typography, Radio, Space, Select, RadioChangeEvent, Modal, Spin } from 'antd'
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import styled from '@emotion/styled'
import { useContext, useRef, useState } from 'react'
import { WizardContext } from '../context'

const useStyles = createUseStyles({
})

const { Title, Text } = Typography

interface INetworkSelectorProps {
  setCurrent: (step: number) => void // update the session creator steps
  setSelectedNetwork: (name: string) => void
  moveToNetwork: (main: string) => void
}

function NetworkSelector(props: INetworkSelectorProps) {
  const classes = useStyles()
  const { setCurrent, setSelectedNetwork, moveToNetwork } = props  
  const { networkStore } = useContext(WizardContext)

  // true for select an existing one, false for upload a new one
  const [netSource, setNetSource] = useState<boolean>() 
  // selected network for preview
  const [network, setNetwork] = useState<string>()
  // when users select to upload a new vis, spin 3 seconds to maintain mental modal
  const [loading, setLoading] = useState<boolean>(false)

  const handleNext = () => {
    // TODO: examine if network has been selected
    if (network && network.length > 0) {
      setCurrent(1)
      setSelectedNetwork(network)
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
    if (e.target.value) { // select an existing network
    }
    else { // upload a new visualization
      setLoading(true)
      setTimeout(()=>moveToNetwork('network'), 2000) 
    }
  }
  


  return (
    <>
      <Spin spinning={loading}>
        <Title level={3}>Choose a network to visualize: </Title>

        <MySpace direction='vertical'>
          <Radio.Group onChange={onTypeChange}>
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