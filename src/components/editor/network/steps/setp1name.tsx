import { createUseStyles } from 'react-jss'
import { useEffect } from 'react';
import { Typography, Form, Input } from 'antd';
import { Step1NameDataType, StepFormDataType } from '../../../../../typings';

const { Title, Paragraph, Text, Link } = Typography;

const useStyles = createUseStyles({
})

interface IStep1NameProps {
  data: StepFormDataType;
  onSuccess: (data: Step1NameDataType, step: number) => void;
}

function Step1Name(props: IStep1NameProps) {
  const classes = useStyles()

  const { onSuccess, data } = props;

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
      style={{ margin: "0 100px", maxWidth: "60vw", textAlign: "left" }}
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
    </Form>
  )
}

export default Step1Name