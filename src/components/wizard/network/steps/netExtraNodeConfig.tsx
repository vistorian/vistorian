import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss'
import { Typography, Form, Radio, Space, Col, Row, Select, Button, message } from 'antd';
import { StepData, IStepProps, SelectOptionType } from '../../../../../typings';
import { LeftOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
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
  const file = Form.useWatch('file', form)

  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [selectionOptions, setSelectionOptions] = useState<SelectOptionType[]>([])
  const [nodeTypes, setNodTypes] = useState<Array<string|null>>(['', null, null])


  const onFinish = (values: StepData) => {
    if (hasExtraNode && !file) {
      message.error('You shoud upload your link table first!')
      return
    } 
    // console.log('extraNodeConfig', values)
    onSuccess(values, 'extraNodeConfig');
  };

  const add = () => {
    const tmp = [...nodeTypes]
    const idx = tmp.findIndex((t) => t===null)
    if (idx > -1) {
      tmp[idx] = ''
      setNodTypes(tmp)
    }
    form.setFieldsValue({ 'nodeTypes': tmp })
  }
  
  const remove = (idx: number) => {
    let tmp = [...nodeTypes]
    // special: as the array can only have 3 items and the remove operation only happen in 2nd or 3rd item
    if (idx === 1 ) { // delete 2nd item
      tmp = [tmp[0], tmp[2], null]
    }
    else {// delete 3rd item
      tmp[idx] = null
    }
    setNodTypes(tmp)
    form.setFieldsValue({ 'nodeTypes': tmp })
  }

  const update = (value: string, idx: number) => {
    const tmp = [...nodeTypes]
    tmp[idx] = value
    setNodTypes(tmp)
    form.setFieldsValue({ 'nodeTypes': tmp })
  }

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
          
          {nodeTypes.map((nodeType, index) => {
            if (nodeType !== null) {
              return (
                <>
                  <Form.Item
                    name="nodeTypes"
                    style={{ marginBottom: 5 }}
                    rules={[{ required: false }]}
                    key={`${index}-${nodeType}`}
                  >
                    <div className={classes.selection}>
                      <Text className={classes.selectionName}>- Node Type {index + 1}:</Text>
                      <Select style={{ width: 300 }}
                        options={selectionOptions}
                        value={nodeType}
                        onChange={(value) => update(value, index)}
                      />
                    </div>
                  </Form.Item>
                  {index !== 0 ? <Button onClick={() => remove(index)}>Delete this node type</Button> : null}
                </>
              )
            }
          })}
          {(nodeTypes[2]===null) ? <Button onClick={() => add()} icon={<PlusOutlined />}>Add more node types</Button> : null}
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