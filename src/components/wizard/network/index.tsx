import { createUseStyles } from 'react-jss'
import { useState, useEffect, useContext } from 'react'
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
import { NetworkConfig, StepType, StepData, NetworkName, NetworkFormat, LinkType, LinkTableConfig, RelationType, LocationTableConfig, NodeTableConfig, ExtraNodeConfig, DataFile } from '../../../../typings'
import { WizardContext } from '../context'
import { findIndex } from 'lodash-es'


const useStyles = createUseStyles({
})

interface INetworkProps {
  moveToNewSession: (type: string) => void
  setSelectedNetwork: (name: string) => void
  setNetSource: (type: boolean|undefined) => void
}

function Network(props: INetworkProps) {
  const classes = useStyles()
  const { moveToNewSession, setSelectedNetwork, setNetSource } = props
  const [currentStep, setCurrentStep] = useState<StepType>('name')
  const { networkStore, setNetworkStore, fileNameStore, setFileNameStore } = useContext(WizardContext)

  // record the configuration specified from the users
  const [data, setData] = useState<NetworkConfig>({
    name: null,
    format: null,
    linkType: null,
    linkTableConfig: null,
    locationTableConfig: null,
    nodeTableConfig: null,
    extraNodeConfig: null,
  })
  const initSteps = ['name', 'format', 'linkType'] as StepType[]
  const [steps, setSteps] = useState<StepType[]>(initSteps)
  const [stepItems, setStepItems] = useState<any[]>([])

  const handlePrevStep = (step: StepType) => {
    const idx = steps.indexOf(step)
    if (idx > 0)
      setCurrentStep(steps[idx-1])
  }

  const handleNextStep = (stepData: StepData, step: StepType) => {
    let newSteps = [...steps]
    let newData = {...data}
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
          newSteps = [...initSteps, 'linkTableConfig']
          setSteps(newSteps)
        }
        else {// 'rowPerNode'
          newSteps = [...initSteps, 'nodeTableConfig']
          setSteps(newSteps)
        } 
        break
      case 'linkTableConfig':
        newData.linkTableConfig = stepData as LinkTableConfig
        setData(newData)
        // @ts-ignore
        if (stepData.locationOfSourceNode || stepData.locationOfTargetNode) {
          newSteps = [...steps, 'locationTableConfig', 'extraNodeConfig']
          setSteps(newSteps)
        }
        else {
          newSteps = [...steps, 'extraNodeConfig']
          setSteps(newSteps)
        }
        break
      case 'locationTableConfig': 
        newData.locationTableConfig = stepData as LocationTableConfig
        setData(newData)
        break
      case 'extraNodeConfig':
        newData.extraNodeConfig = stepData as ExtraNodeConfig
        setData(newData)
        break
      case 'nodeTableConfig':
        newData.nodeTableConfig = stepData as NodeTableConfig
        setData(newData)
        break
      default:
        message.error('Invalid step!')
    }
    // console.log('newData:', newData)
    // deal with fileNameStore updates
    // which should not be within steps, as components would be updated
    if (stepData && 'file' in stepData) {
      if (findIndex(fileNameStore, (fn: DataFile) => fn.name === stepData.file) === -1) {
        const tmp = {
          name: stepData.file,
          hasHeader: true
        } as DataFile
        setFileNameStore([...fileNameStore, tmp])
      } 
    }

    const idx = newSteps.indexOf(step)
    // condition: at the end of the network configuration
    if (idx === newSteps.length-1){
      // update networkStore
      window.localStorage.setItem("NETWORK_DEFINITION_" + newData.name?.name, JSON.stringify(newData))
      setNetworkStore([...networkStore, newData.name?.name as string])
      // select the configured network by default, and move to visSelector
      setSelectedNetwork(newData.name?.name as string)
      moveToNewSession('newSession')
      setNetSource(false)
    }
    else // condition: move to next step
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
      title: 'Link Table',
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
    <>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10}}>
        <h2>Creating New Network</h2>
        <Steps
          current={steps.indexOf(currentStep)}
          items={stepItems}
        />
      </div>
    
      <Content>
        { // @ts-ignore
          allSteps[currentStep].content
        }
      </Content>
    </>
  )
}

const MyButton = styled(Button)({
  width: 130,
  marginTop: 40
})

export default Network