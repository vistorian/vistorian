import { useEffect } from 'react';
import { Button, Typography, Form, Radio, Space, Col, Row, ButtonProps } from 'antd';
import { StepData, IStepProps } from '../../../../../typings';
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const { Title, Paragraph, Text, Link } = Typography;

function NetFormat(props: IStepProps) {
  const { data, MyButton, onSuccess, onPrevious } = props

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...data.format })
  }, [])

  const onFinish = (values: StepData) => {
    onSuccess(values, 'format');
  };

  return (
    <Form
      name="basic"
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
            <Text>&nbsp;
                in Microsoft Excel, click <Link href="https://support.office.com/en-ie/article/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba">
                  {"File > Save As > Select file type 'CSV'"}</Link>
            </Text>
            <Text>&nbsp;&nbsp;
                {"in Apple Numbers, click File -> Export to -> CSV"}
            </Text>
            <Text>&nbsp;&nbsp;
                {"in Google Sheets click File -> Download as -> Comma-separated values"}
            </Text>
            <Text>&nbsp;
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
      
      <Form.Item>
        <Row>
          <Col span={8} style={{ display: "flex" }}>
            <MyButton type={"primary"} onClick={() => onPrevious('format')} icon={<LeftOutlined />}>
              Previous
            </MyButton>
          </Col>
          <Col span={8} offset={8} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <MyButton type="primary" htmlType="submit">
              Next <RightOutlined />
            </MyButton>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
}

const MySpace = styled(Space)({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  textAlign: "left"
})

const MyParagraph = styled(Paragraph)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  textAlign: "left"
})

const MyTitle = styled(Title)({
  marginTop: 20,
  marginBottom: 20
})

export default NetFormat