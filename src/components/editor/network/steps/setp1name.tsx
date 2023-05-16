import { useEffect } from 'react';
import { Typography, Form, Input, ButtonProps, Row, Col } from 'antd';
import { Step1NameDataType, StepFormDataType } from '../../../../../typings';
import { RightOutlined } from '@ant-design/icons'

const { Title} = Typography;


interface IStep1NameProps {
  data: StepFormDataType;
  MyButton: React.FunctionComponent<ButtonProps>;
  onSuccess: (data: Step1NameDataType, step: number) => void;
}

function Step1Name(props: IStep1NameProps) {

  const { onSuccess, data, MyButton } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...data.step1Name });
  }, []);

  const onFinish = (values: Step1NameDataType) => {
    onSuccess(values, 1);
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
        label={<Title level={3}>Enter a name for your network:</Title>}
        name="name"
        rules={[{ required: true, message: 'Enter a name for your network.' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Row>
          <Col span={8} offset={16} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <MyButton type="primary" htmlType="submit">
              Next <RightOutlined />
            </MyButton>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
}

export default Step1Name