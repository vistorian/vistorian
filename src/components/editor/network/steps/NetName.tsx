import { useContext, useEffect } from 'react';
import { Typography, Form, Input, ButtonProps, Row, Col } from 'antd'; 
import { RightOutlined } from '@ant-design/icons'
import { StepData, IStepProps } from '../../../../../typings'
import { EditorContext } from '../../context';

const { Title} = Typography;

function NetName(props: IStepProps) {

  const { onSuccess, data, MyButton } = props;
  const { networkStore, setNetworkStore } = useContext(EditorContext)

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...data.name });
  }, []);

  const onFinish = (values: StepData) => {
    onSuccess(values, 'name');
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

export default NetName