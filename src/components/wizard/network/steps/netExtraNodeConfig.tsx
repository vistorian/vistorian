import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss'
import { Typography, Form, Radio, Space, Col, Row, Select } from 'antd';
import { StepData, IStepProps, SelectOptionType } from '../../../../../typings';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import FileSelector from './fileSelector';
import TablePreview from './tablePreview';

const useStyles = createUseStyles({
  selection: {
    display: 'flex'
  },
  selectionName: {
    width: 250,
    fontSize: 16,
  }
})

const { Title, Paragraph, Text, Link } = Typography;

function NetExtraNodeConfig(props: IStepProps) {
  const classes = useStyles()

  const { data, MyButton, onSuccess, onPrevious } = props

  const [form] = Form.useForm();
  const hasExtraNode = Form.useWatch('hasExtraNode', form)

  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [selectionOptions, setSelectionOptions] = useState<SelectOptionType[]>([])


  useEffect(() => {
    form.setFieldsValue({ ...data.extraNodeConfig })
  }, [])

  const onFinish = (values: StepData) => {
    onSuccess(values, 'extraNodeConfig');
  };

  return (
    <Form
      name="basic"
      initialValues={{ hasHeaderRow }}
      onFinish={onFinish}
      autoComplete="off"
      layout={"vertical"}
      form={form}
      requiredMark={false}
    >
      <Form.Item
        label={<Title level={3}>Do you have an extra file recording node types?</Title>}
        htmlFor='net-config-hasExtraNode'
        name="hasExtraNode"
        rules={[{ required: true, message: 'This is required.' }]}
      >
        <Radio.Group id="net-config-hasExtraNode">
          <MySpace direction="vertical">
            <Radio value={true}><b>Yes</b>, I have a file recording the type for each node.</Radio>
            <Radio value={false}><b>No</b>, I do not have a file recording the type for each node.</Radio>
          </MySpace>
        </Radio.Group>
      </Form.Item>

      {hasExtraNode ? <>
        <FileSelector
          setDataInTable={setDataInTable}
          setColumnInTable={setColumnInTable}
          hasHeaderRow={hasHeaderRow}
          setSelectionOptions={setSelectionOptions}
          selectedFileName={selectedFileName}
          setSelectedFileName={setSelectedFileName}
          form={form}
        />

        {selectedFileName.length > 0 ? <>
          <TablePreview
            hasHeaderRow={hasHeaderRow}
            setHasHeaderRow={setHasHeaderRow}
            columnInTable={columnInTable}
            dataInTable={dataInTable}
          />

          <Form.Item
            name="nodeID"
            style={{ marginTop: 20, marginBottom: 5 }}
            rules={[{ required: false }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Node ID:</Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'nodeID': value })}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="nodeType"
            style={{ marginBottom: 5 }}
            rules={[{ required: false }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Node Type:</Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'nodeType': value })}
              />
            </div>
          </Form.Item>
          
        </>: null}
      </>: null}

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

export default NetExtraNodeConfig