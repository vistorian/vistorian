import { createUseStyles } from 'react-jss'
import { useState, useEffect } from 'react'
import { Steps, theme, Typography, Button} from "antd"
import type { StepProps } from "antd"
import styled from "@emotion/styled"

import Step1Name from './steps/setp1name'
import Step2Format from './steps/step2format'
import Step3Link from './steps/step3Link'
import Step4Specify from './steps/step4specify'
import Step5LocationSpec from './steps/Step5locationspec'
import Step6NodeSpec from './steps/step6nodespec'
import { StepFormDataType, Step1NameDataType, Step2FormatDataType, Step3LinkDataType, Step4SpecifyDataType, Step5LocationSpecDataType, Step6NodeSpecDataType } from '../../../../typings'

const useStyles = createUseStyles({
})


function StepForm() {
  const classes = useStyles()

  const [data, setData] = useState<StepFormDataType>({
    step1Name: null,
    step2Format: null,
    step3Link: null,
    step4Specify: null,
    step5LocationSpec: null,
    step6NodeSpec: null
  })

  // const updateDataTableInfo = (dataInTable: any[], hasHeaderRow: boolean, columnInTable: any[]) => {
  //   store.updateDataTable(dataInTable, hasHeaderRow, columnInTable)
  // }

  const handlePrevStep = (step: number) => {
    if (step >= 1) {
      setCurrentStep(step - 1);
    }
  }

  const handleNextStep = (stepData: Step1NameDataType | Step2FormatDataType | Step3LinkDataType | Step4SpecifyDataType | Step5LocationSpecDataType | Step6NodeSpecDataType, step: number) => {
    if (step === 1) {
      setData({ ...data, step1Name: stepData as Step1NameDataType })
    } else if (step === 2) {
      setData({ ...data, step2Format: stepData as Step2FormatDataType })
    } else if (step === 3) {
      setData({ ...data, step3Link: stepData as Step3LinkDataType })
    } else if (step === 4) {
      setData({ ...data, step4Specify: stepData as Step4SpecifyDataType })
      // handleFinish(stepData as Step4SpecifyDataType, 4)
    } else if (step === 5) {
      setData({ ...data, step5LocationSpec: stepData as Step5LocationSpecDataType })
    } else if (step === 6) {
      // todo nodeType data driven
      setData({ ...data, step6NodeSpec: stepData as Step6NodeSpecDataType })
      // handleFinish(stepData as Step6NodeSpecDataType, 6)
    }
    if (step < 6) {
      setCurrentStep(step + 1);
    }
  }

  const MyButton = styled(Button)({
    width: 130,
    marginTop: 40
  })

  const initSteps = [
    {
      title: 'Name',
      content: <Step1Name 
        data={data} 
        onSuccess={handleNextStep}
        MyButton={MyButton} 
      />,
      description: 'Enter a name for your network.'
    },
    {
      title: 'Format',
      content: <Step2Format 
        data={data} 
        onSuccess={handleNextStep} 
        onPrevious={handlePrevStep} 
        MyButton={MyButton} 
      />,
      description: 'What is the format of your data?'
    },
    {
      title: 'Link',
      content: <Step3Link 
        data={data} 
        onSuccess={handleNextStep} 
        onPrevious={handlePrevStep} 
        MyButton={MyButton} 
      />,
      description: 'How are links (edges) represented in your network?'
    },
    {
      title: 'File',
      content: <Step4Specify 
        data={data} 
        // updateDataTableInfo={updateDataTableInfo} 
        onSuccess={handleNextStep} 
        onPrevious={handlePrevStep} 
        MyButton={MyButton} 
      />,
      description: 'Specifying your table.'
    }
  ]

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<any[]>([]);
  const [stepItems, setStepItems] = useState<any[]>([])


  useEffect(() => {
    // console.log("data: ", data)
    if (!data.step3Link) {
      setSteps(initSteps)
      return
    }
    if (data.step3Link.link === "rowPerLink") {
      const linkSteps = initSteps.concat([
        {
          title: 'Location',
          content: <Step5LocationSpec></Step5LocationSpec>,
          // content: <Step5LocationSpec 
          //   data={data} 
          //   onSuccess={handleNextStep} 
          //   onPrevious={handlePrevStep} />,
          description: 'Specifying the location.'
        },
        {
          title: 'Node Type',
          content: <Step6NodeSpec></Step6NodeSpec>,
          // content: <Step6NodeSpec data={data} onSuccess={handleNextStep} onPrevious={handlePrevStep} />,
          description: 'Specifying the node type.'
        }
      ]);
      setSteps(linkSteps)
    } else if (data.step3Link.link === "rowPerNode") {
      console.log('rowpernode')
      setSteps(initSteps)
    }
  }, [data])

  useEffect(() => {
    const items: StepProps[] = steps.map((item) => ({
      key: item.title,
      title: item.title,
      description: item.description
    }));
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
    border: `1px dashed ${token.colorBorder}`,
    height: '65vh',
    overflow: 'scroll'
  })

  return (
    <div className='root'>
      <Steps 
        current={currentStep - 1} 
        // labelPlacement="vertical" 
        items={stepItems} 
      />

      <Content>
        {steps.length === 0 ? initSteps[currentStep - 1].content : steps[currentStep - 1].content}
      </Content>
    </div>
  )
}

export default StepForm