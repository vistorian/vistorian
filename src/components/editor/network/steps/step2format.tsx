import { createUseStyles } from 'react-jss'
import { useEffect } from 'react';
import { Button, Typography, Form, Radio, Space, Col, Row } from 'antd';
import { Step2FormatDataType, StepFormDataType } from '../../../../../typings';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const useStyles = createUseStyles({
})

interface IStep2FormatProps {
  data: StepFormDataType;
  onSuccess: (data: Step2FormatDataType, step: number) => void;
  onPrevious: (step: number) => void;
}

function Step2Format(props: IStep2FormatProps) {
  const classes = useStyles()

  return (
    <Form
      name="basic"
      style={{ margin: "0 100px", maxWidth: "60vw", textAlign: "left" }}
      onFinish={onFinish}
      autoComplete="off"
      layout={"vertical"}
      form={form}
      requiredMark={false}
    >
      <Form.Item
        label={<Title level={3}>What is the format of your data?</Title>}
        name="format"
        rules={[{ required: true, message: 'Enter the format of your data.' }]}
      >
        <Radio.Group>
          <MySpace direction="vertical">
            <Radio value={"tabular"}>
              <MyTitle level={4} style={{ marginBottom: 20 }} >Table Format</MyTitle>
            </Radio>
            <Text italic>
              <InfoCircleOutlined />&nbsp;&nbsp;
              If your data is in Excel, export it to CSV. If you have multiple workbooks, export each as a separate file:
            </Text>
            <ul>
              <li>
                in Microsoft Excel, click <Link href="https://support.office.com/en-ie/article/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba">
                  {"File > Save As > Select file type 'CSV'"}</Link>
              </li>
              <li>
                {"in Apple Numbers, click File -> Export to -> CSV"}
              </li>
              <li>
                {"in Google Sheets click File -> Download as -> Comma-separated values"}
              </li>
            </ul>
            <Text>
              or you can create <Text type="danger">CSV</Text> by hand in any text editor.
            </Text>
            <Radio value={"other"}>
              <MyTitle level={4} style={{ marginBottom: 20 }}>Other Format</MyTitle>
            </Radio>
            <MyParagraph>
              I have a file in a specific&nbsp;<b>network format</b>&nbsp;(e.g., GEDCOM, PAJEK or GraphML (XML))
            </MyParagraph>
          </MySpace>
        </Radio.Group>
      </Form.Item>
    </Form>
  )
}

export default Step2Format