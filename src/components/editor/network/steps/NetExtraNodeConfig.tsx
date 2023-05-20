import { useEffect } from 'react';
import { createUseStyles } from 'react-jss'
import { Button, Typography, Form, Radio, Space, Col, Row, ButtonProps } from 'antd';
import { StepData, IStepProps } from '../../../../../typings';
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const useStyles = createUseStyles({
})

const { Title, Paragraph, Text, Link } = Typography;

function NetExtraNodeConfig(props: IStepProps) {
  const classes = useStyles()

  const { data, MyButton, onSuccess, onPrevious } = props

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...data.format })
  }, [])

  const onFinish = (values: StepData) => {
    onSuccess(values, 'extraNodeConfig');
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
        label={<Title level={3}>Do you have an extra file recording node types?</Title>}
        name="hasExtraNode"
        rules={[{ required: true, message: 'This is required.' }]}
      >
        <Radio.Group>
          <MySpace direction="vertical">
            <Radio value={true}>Yes, I have a file recording the type for each node.</Radio>
            <Radio value={false}>No, I do not have a file recording the type for each node.</Radio>
          </MySpace>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Row>
          <Col span={8} style={{ display: "flex" }}>
            <MyButton type={"primary"} onClick={() => onPrevious('extraNodeConfig')} icon={<LeftOutlined />}>
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

export default NetExtraNodeConfig