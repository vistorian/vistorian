import { createUseStyles } from 'react-jss'
import { useState, useEffect, useContext } from 'react'
import { Steps, theme, Typography, Button, message} from "antd"
import type { StepProps } from "antd"
import styled from "@emotion/styled"

import NetName from './steps/netName'
import NetFormat from './steps/netFormat'
import NetLinkConfig from './steps/netLinkConfig'
import NetLocationConfig from './steps/netLocationConfig'
import NetExtraNodeConfig from './steps/netExtraNodeConfig'
import { NetworkConfig, StepType, StepData, NetworkName, NetworkFormat, LinkTableConfig, LocationTableConfig, ExtraNodeConfig } from '../../../../typings'
import { WizardContext } from '../context'


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

  const { networkStore, setNetworkStore, fileNameStore, setFileNameStore } = useContext(WizardContext)

  // record the configuration specified from the users
  const [data, setData] = useState<NetworkConfig>({
    name: null,
    format: null,
    linkTableConfig: null,
    locationTableConfig: null,
    extraNodeConfig: null,
  })
  const baseSteps = ['name', 'format', 'linkTableConfig', 'extraNodeConfig'] as StepType[]
  const locationSteps = ['name', 'format', 'linkTableConfig', 'locationTableConfig', 'extraNodeConfig'] as StepType[]
  const [steps, setSteps] = useState<StepType[]>(baseSteps)
  const [currentStep, setCurrentStep] = useState<StepType>('name')
  const [stepItems, setStepItems] = useState<any[]>([]) // for antd steps

  const handlePrevStep = (step: StepType) => {
    const idx = steps.indexOf(step)
    if (idx > 0)
      setCurrentStep(steps[idx-1])
  }

  const handleNextStep = (stepData: StepData, step: StepType) => {
    let newSteps = [...steps]
    let newData = { ...data }
    switch (step) {
      case 'name':
        newData.name = stepData as NetworkName
        setData(newData)
        break
      case 'format':
        newData.format = stepData as NetworkFormat
        setData(newData)
        break
      case 'linkTableConfig':
        newData.linkTableConfig = stepData as LinkTableConfig
        setData(newData)
        // @ts-ignore
        if (stepData.locationOfSourceNode || stepData.locationOfTargetNode) {
          newSteps=[...locationSteps]
          setSteps(locationSteps)
        }
        else {
          newSteps = [...baseSteps]
          setSteps(baseSteps)
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
      default:
        message.error('Invalid step!')
    }

    // update fileNameStore after this step to avoid components updating meanwhile
    if (stepData && 'dragger' in stepData) {
      const index = fileNameStore.indexOf(stepData.file as string)
      // if the file doesn't in flie store, record it. 
      if (index === -1) {
        const tmp = stepData.file as string
        setFileNameStore([...fileNameStore, tmp])
      }
      // else {
        // if the file exists, but the hasHeader updates, update the filestore
        // if (fileNameStore[index].hasHeader !== stepData.hasHeaderRow) {          
        // }
      // }
    }

    const idx = newSteps.indexOf(step)
    // condition: at the end of the network configuration
    if (idx === newSteps.length - 1) {
      // update networkStore
      window.localStorage.setItem("NETWORK_WIZARD_" + newData.name?.name, JSON.stringify(newData))
      // window.localStorage.setItem("NETWORK_SPEC_" + newData.name?.name, JSON.stringify(genSpecFromLinkTable(newData)))
      // console.log('NETWORK_SPEC_', genSpecFromLinkTable(newData))
      
      setNetworkStore([...networkStore, newData.name?.name as string])
      // select the configured network by default
      setSelectedNetwork(newData.name?.name as string)
      // go back to new session and set the network source as "Upload a new network"
      moveToNewSession('newSession')
      setNetSource(false)
    }
    else // condition: move to next step
      setCurrentStep(newSteps[idx + 1])
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
    locationTableConfig: {
      title: 'Location',
      content: <NetLocationConfig
        data={data}
        onSuccess={handleNextStep}
        onPrevious={handlePrevStep}
        MyButton={MyButton} 
      />,
      description: 'Specifying your location table.'
    },
    extraNodeConfig: {
      title: 'Extra Node Type',
      content: <NetExtraNodeConfig 
        data={data}
        onSuccess={handleNextStep}
        onPrevious={handlePrevStep}
        MyButton={MyButton} 
      />,
      description: 'Specifying your extra node types.'
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