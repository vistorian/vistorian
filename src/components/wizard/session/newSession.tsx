import styled from '@emotion/styled'
import { Steps, Typography, message, theme } from 'antd'
import { useState } from 'react'
import { createUseStyles } from 'react-jss'
import VisSelector from '../visSelector'
import NetworkSelector from './networkSelector'

const useStyles = createUseStyles({
})

interface INewSessionProps {
  selectedNetwork: string
  setSelectedNetwork: (data: string) => void
  moveToNetwork: (main: string) => void
}

function NewSession(props: INewSessionProps) {
  const classes = useStyles()
  const { selectedNetwork, setSelectedNetwork, moveToNetwork } = props

  const [current, setCurrent] = useState(0)
  const stepItems = [{
    key: 0,
    title: 'Choose a network', 
  }, {
    key: 1,
    title: 'Choose a visualization',
  }]

  const { token } = theme.useToken();
  const Content = styled(Typography.Paragraph)({
    textAlign: 'left',
    marginTop: 30,
    padding: '0px 30px',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`
  })  

  const renderComp = (step: number) => {
    switch (step) {
      case 0: 
        return <NetworkSelector 
          setCurrent={setCurrent} 
          setSelectedNetwork={setSelectedNetwork}
          moveToNetwork={moveToNetwork}
        />
      case 1: 
        return <VisSelector 
          network={selectedNetwork} 
        />
      default:
        message.error('No such steps!')
    }
  }

  return (
    <>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10}}>
        <h2>Create New Visualization:</h2>
        <Steps
          style={{ maxWidth: 800}}
          current={current}
          items={stepItems}
        />
      </div>

      <Content>
        { renderComp(current) }
      </Content>
      
    </>
  )
}

export default NewSession