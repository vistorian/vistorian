import { useEffect } from 'react';
import { Button, Typography, Form, Radio, Space, Row, Col, Divider, ButtonProps } from 'antd';
import { Step3LinkDataType, StepFormDataType } from '../../../../../typings';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import TablePreview from './tablePreview';

const { Title, Paragraph, Text } = Typography;

interface IStep3LinkProps {
  data: StepFormDataType;
  onSuccess: (data: Step3LinkDataType, step: number) => void;
  onPrevious: (step: number) => void;
  MyButton: React.FunctionComponent<ButtonProps>;
}

function Step3Link(props: IStep3LinkProps) {
  const { onPrevious, onSuccess, data, MyButton } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    // console.log("3: ", data);
    form.setFieldsValue({ ...data.step3Link });
  }, []);

  const onFinish = (values: Step3LinkDataType) => {
    onSuccess(values, 3);
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
        label={<Title level={3}>How are links (edges) represented in your network?</Title>}
        name="link"
        rules={[{ required: true, message: 'Choose the table type.' }]}
      >
        <Radio.Group>
          <MySpace direction="vertical">
            <Radio value={"rowPerLink"}>
              <MyTitle level={4} style={{ marginBottom: 20 }}>
                Link Table
              </MyTitle>
            </Radio>
            <MyParagraph>
              <Text>
                A table containing&nbsp;<b>one row per link</b>&nbsp;. Each row contains a pair of nodes that are linked.
              </Text>
            </MyParagraph>
            <MyTitle level={4} style={{ marginBottom: 0, marginTop: -10 }}>
              Example:
            </MyTitle>
            <TablePreview type={"link"} />
            <Divider />
            <Radio value={"rowPerNode"}>
              <MyTitle level={4} style={{ marginBottom: 20 }}>
                Node Table
              </MyTitle>
            </Radio>
            <MyParagraph>
              <Text>
                A table containing&nbsp;<b>one row per node</b>&nbsp;, with columns listing the other nodes it is linked to (a node file).
              </Text>
            </MyParagraph>
            <MyTitle level={4} style={{ marginBottom: 0, marginTop: -10 }}>
              Example:
            </MyTitle>
            <Row>
              <TablePreview type={"node"} />
            </Row>
          </MySpace>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Row>
          <Col span={8} style={{ display: "flex" }}>
            <MyButton type={"primary"} onClick={() => onPrevious(3)} icon={<LeftOutlined />}>
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

export default Step3Link