import { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { IStepProps, RelationType, SelectOptionType, StepData } from '../../../../../typings'
import { Col, Form, Row, Select, Space, Typography, Button, Input } from 'antd'
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled'
import FileSelector from './fileSelector'
import TablePreview from './tablePreview'

const { Title, Text } = Typography;

const useStyles = createUseStyles({
  selection: {
    display: 'flex'
  },
  selectionName: {
    width: 250,
    fontSize: 16,
  },
  linkName: {
    fontSize: 16,
    marginLeft: 50,
    marginRight: 10
  }
})

function NetNodeConfig(props: IStepProps) {
  const classes = useStyles()
  const { onSuccess, onPrevious, data, MyButton } = props;

  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [selectionOptions, setSelectionOptions] = useState<SelectOptionType[]>([])
  const [relations, setRelations] = useState<RelationType[]>([{column: '', linkName: 'df'} as RelationType])

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...data.nodeTableConfig });
  }, []);

  const onFinish = (values: StepData) => {
    // console.log('locationTableConfig', values)
    onSuccess(values, 'nodeTableConfig');
  };

  const addRelation = () => {
    
  }

  const deleteRelation = () => {

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
      <MySpace direction="vertical">
        <MyTitle level={4}>
          1. Upload your table
        </MyTitle>
        {/* select data files */}
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
            name="node"
            style={{ marginTop: 20, marginBottom: 5 }}
            rules={[{ required: true, message: "This is required!" }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Node:</Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'node': value })}
              />
            </div>
          </Form.Item>

          <MyTitle level={4}>
            2. Specify relations
          </MyTitle>
          {
            relations.length === 0 ? 
            <>
              <span>You must define at least one relation type.</span>
              <Button onClick={() => addRelation()}>+ Add relation</Button>
            </>
            :
            <>
              <Form.Item
              name="relations"
              style={{ margin: 0 }}
              rules={[{ required: true, message: "This is required!" }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Column:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                  />
                  <Text className={classes.linkName}>Link name (type):</Text>
                  <Input style={{ width: 300 }} />
                </div>
              </Form.Item>
              <Button onClick={() => deleteRelation()}>Delete this relation</Button>
            </>
          }          
        </>: null}
      </MySpace>

      <Form.Item>
        <Row>
          <Col span={8} style={{ display: "flex" }}>
            <MyButton type={"primary"} onClick={() => onPrevious('nodeTableConfig')} icon={<LeftOutlined />}>
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

const MyTitle = styled(Title)({
  marginTop: 20,
  marginBottom: 20
})


export default NetNodeConfig