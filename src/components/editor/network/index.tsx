import { createUseStyles } from 'react-jss'
import { useContext, useState } from 'react'
import { Button, Modal } from 'antd'
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons'
import { EditorContext } from '../context'
import StepForm from './stepform'
import { StepType } from '../../../../typings'

const useStyles = createUseStyles({
})

interface INetworkProps {
  moveToVis: (type: string) => void // move to tab-3
  setSelectedNetwork: (type: string) => void 
}

function Network(props: INetworkProps) {
  const { moveToVis, setSelectedNetwork } = props
  
  const [selected, setSelected] = useState('')
  const [currentStep, setCurrentStep] = useState<StepType>('name')

  const { networkStore, setNetworkStore } = useContext(EditorContext)

  return (
    <>
      <h2>Creating New Network</h2>
      <StepForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setSelected={setSelected}
        setSelectedNetwork={setSelectedNetwork}
        moveToVis={moveToVis}
        networkStore={networkStore}
        setNetworkStore={setNetworkStore}
      />
    </>
  )
}

export default Network