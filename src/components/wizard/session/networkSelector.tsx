import { Button, Col, Row, Typography, Radio, Space, Select, RadioChangeEvent, Modal } from 'antd'
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import styled from '@emotion/styled'
import { useContext, useState } from 'react'
import { WizardContext } from '../context'

const useStyles = createUseStyles({
})

const { Title, Text } = Typography

interface INetworkSelectorProps {
  setCurrent: (step: number) => void
}

function NetworkSelector(props: INetworkSelectorProps) {
  const classes = useStyles()
  const { setCurrent } = props  
  const { networkStore } = useContext(WizardContext)

  // true for select an existing one, false for upload a new one
  const [netSource, setNetSource] = useState<boolean>() 

  const handleNext = () => {
    // TODO: examine if network has been selected
    setCurrent(1)
  }

  const getNetworkList = () => {
    return networkStore.map((n: string) => {
      return {
        label: n,
        value: n
      }
    })
  }

  const onSelectionChange = (e: RadioChangeEvent) => {
    if (e.target.value) { // select an existing network
      
    }
    else { // upload a new visualization
      
    }
    setNetSource(e.target.value)
  }

  return (
    <>
      <Title level={3}>Choose a network to visualize: </Title>

      <MySpace direction='vertical'>
        <Radio.Group onChange={onSelectionChange}>
          <MySpace direction='vertical'>
            <Radio value={'true'}>
              <Text style={{ fontSize: 18, paddingTop: 4, marginRight: 10 }}>
                Select a previously uploaded network:
              </Text>
              <Select
                style={{ width: 300 }}
                options={getNetworkList()}
                disabled={!netSource}
              />
            </Radio>
            <Radio value={false}>
              <Text style={{ fontSize: 18, paddingTop: 4, marginRight: 10 }}>
                Upload a new network
              </Text>              
            </Radio>
            <Text style={{ fontSize: 16, paddingTop: 4, color: 'red', marginLeft: 24 }}>
              <InfoCircleOutlined style={{marginRight: 5}}/>
              "Upload a new network" will redirect you to the steps that upload a new network first and then return back to this page. 
            </Text>
          </MySpace>
        </Radio.Group>
      </MySpace>

      <Modal>
        Are you sure to 
      </Modal>

      <Row>
        <Col span={8} offset={16} style={{ display: "flex", flexDirection: "row-reverse" }}>
          <MyButton type="primary" onClick={() => handleNext()}>
            Next <RightOutlined />
          </MyButton>
        </Col>
      </Row>
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