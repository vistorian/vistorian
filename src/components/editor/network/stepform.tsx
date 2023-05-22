import { createUseStyles } from 'react-jss'
import { useState, useEffect } from 'react'
import { Steps, theme, Typography, Button, message} from "antd"
import type { StepProps } from "antd"
import styled from "@emotion/styled"

import NetName from './steps/netName'
import NetFormat from './steps/netFormat'
import NetLinkType from './steps/netLinkType'
import NetLinkConfig from './steps/netLinkConfig'
import NetLocationConfig from './steps/netLocationConfig'
import NetNodeConfig from './steps/netNodeConfig'
import NetExtraNodeConfig from './steps/netExtraNodeConfig'
import { NetworkConfig, StepType, StepData, NetworkName, NetworkFormat, LinkType, LinkTableConfig, RelationType, LocationTableConfig, NodeTableConfig, ExtraNodeConfig } from '../../../../typings'


const useStyles = createUseStyles({
})

interface IStepFormProps {
  currentStep: StepType,
  setCurrentStep: (step: StepType) => void
  setSelected: (preview: string) => void
  networkStore: string[]
  setNetworkStore: (ns: string[]) => void
  moveToVis: (type: string) => void
  setSelectedNetwork: (name: string) => void
}

function StepForm(props: IStepFormProps) {
  const classes = useStyles()
  const { setSelected, moveToVis, networkStore, setNetworkStore, currentStep, setCurrentStep, setSelectedNetwork } = props

  const [data, setData] = useState<NetworkConfig>({
    name: null,
    format: null,
    linkType: null,
    linkTableConfig: null,
    locationTableConfig: null,
    nodeTableConfig: null,
    extraNodeConfig: null,
  })

  const [steps, setSteps] = useState<StepType[]>(['name', 'format', 'linkType'])
  const [stepItems, setStepItems] = useState<any[]>([])

  const MyButton = styled(Button)({
    width: 130,
    marginTop: 40
  })

  const handlePrevStep = (step: StepType) => {
    const idx = steps.indexOf(step)
    if (idx > 0)
      setCurrentStep(steps[idx-1])
  }

  const handleNextStep = (stepData: StepData, step: StepType) => {
    const newSteps = [...steps]
    const newData = {...data}
    switch(step) {
      case 'name': 
        newData.name = stepData as NetworkName
        setData(newData)
        break
      case 'format':
        newData.format = stepData as NetworkFormat
        setData(newData)
        break
      case 'linkType': 
        newData.linkType = stepData as LinkType
        setData(newData)
        // @ts-ignore
        if (stepData.linkType === 'rowPerLink') {
          newSteps.push('linkTableConfig')
          setSteps(newSteps)
        }
        else {// 'rowPerNode'
          newSteps.push('nodeTableConfig')
          setSteps(newSteps)
        } 
        break
      case 'linkTableConfig':
        newData.linkTableConfig = stepData as LinkTableConfig
        setData(newData)
        // @ts-ignore
        if (stepData.locationOfSourceNode || stepData.locationOfTargetNode) {
          newSteps.push('locationTableConfig', 'extraNodeConfig')
          setSteps(newSteps)
        }
        else {
          newSteps.push('extraNodeConfig')
          setSteps(newSteps)
        }
        break
      case 'extraNodeConfig':
        newData.extraNodeConfig = stepData as ExtraNodeConfig
        setData(newData)
        break
      default:
        message.error('invalid step!')
    }

    const idx = newSteps.indexOf(step)
    if (idx === newSteps.length-1){
      window.localStorage.setItem("NETWORK_DEFINITION_" + newData.name?.name, JSON.stringify(newData))
      setSelected(newData.name?.name as string)
      setNetworkStore([...networkStore, newData.name?.name as string])
      setSelectedNetwork(newData.name?.name as string)
      moveToVis('vis')
    }
    else
      setCurrentStep(newSteps[idx+1])
  }

  const allSteps = {
    name: {
      title: 'Name',
      content: <NetName 
        data={data} 
        onPrevious={handlePrevStep}
        onSuccess={handleNextStep}
        MyButton={MyButton} 
      />,
      description: 'Enter a name for your network.'
    },
    format: {
      title: 'Format',
      content: <NetFormat 
        data={data} 
        onSuccess={handleNextStep} 
        onPrevious={handlePrevStep} 
        MyButton={MyButton} 
      />,
      description: 'What is the format of your data?'
    },
    linkType: {
      title: 'Link',
      content: <NetLinkType 
        data={data} 
        onSuccess={handleNextStep} 
        onPrevious={handlePrevStep} 
        MyButton={MyButton} 
      />,
      description: 'How are links (edges) represented in your network?'
    },
    linkTableConfig: {
      title: 'File',
      content: <NetLinkConfig 
        data={data} 
        onSuccess={handleNextStep} 
        onPrevious={handlePrevStep} 
        MyButton={MyButton} 
      />,
      description: 'Specifying your link table.'
    },
    nodeTableConfig: {
      title: 'Node Type',
      content: <NetNodeConfig 
        data={data}
        onSuccess={handleNextStep}
        onPrevious={handlePrevStep}
        MyButton={MyButton} 
      />,
      description: 'Specifying the node type.'
    },
    locationTableConfig: {
      title: 'Location',
      content: <NetLocationConfig
        data={data}
        onSuccess={handleNextStep}
        onPrevious={handlePrevStep}
        MyButton={MyButton} 
      />,
      description: 'Specifying location table.'
    },
    extraNodeConfig: {
      title: 'Extra Node Type',
      content: <NetExtraNodeConfig 
        data={data}
        onSuccess={handleNextStep}
        onPrevious={handlePrevStep}
        MyButton={MyButton} 
      />,
      description: 'Specifying your extra node type.'
    }
  }

  useEffect(() => {
    // @ts-ignore
    const items: StepProps[] = steps.map((step: StepType) => allSteps[step])
                                  .map((item) => ({
                                    key: item.title,
                                    title: item.title,
                                    description: item.description
                                  }));
    // console.log('items:', items)
    setStepItems(items)
  }, [steps])


  const { token } = theme.useToken();
  const Content = styled(Typography.Paragraph)({
    lineHeight: '260px',
    textAlign: 'left',
    marginTop: 16,
    padding: '0px 30px',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`
  })

  return (
    <div className='root'>
      <Steps 
        current={steps.indexOf(currentStep)} 
        items={stepItems} 
      />

      <Content>
        {/* 
        // @ts-ignore */}
        {allSteps[currentStep].content}
      </Content>
    </div>
  )
}

export default StepForm