import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss'
import { Typography, Form, Radio, Space, Col, Row, Select, Button, message, Tooltip } from 'antd';
import { StepData, IStepProps, SelectOptionType } from '../../../../../typings';
import { LeftOutlined, RightOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import FileSelector from './fileSelector';
import TablePreview from './tablePreview';
import {node} from "graphology-metrics";
import {Node} from "@babel/core";

const useStyles = createUseStyles({
  selection: {
    display: 'flex'
  },
  selectionName: {
    width: 250,
    fontSize: 16,
  }
})

enum NodeAttrType {
  nodetype,
  numericalAttribute,
  categoricalAttribute,
  temporalAttribute,
  spatialAttribute
}


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
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(false)
  const [selectionOptions, setSelectionOptions] = useState<SelectOptionType[]>([])
  const [nodeTypes, setNodTypes] = useState<Array<string|null>>(['', null, null])
  const [numericalNodeAttriutes, setNumAttributes] = useState<Array<string|null>>([null, null, null])


  const onFinish = (values: StepData) => {
    if (hasExtraNode && !file) {
      message.error('You shoud upload your link table first!')
      return
    }

    // TODO: save here node attributes? Currently not saved
    console.log('extraNodeConfig', values)
    onSuccess(values, 'extraNodeConfig');
  };

  // const add = () => {
  //   const tmp = [...nodeTypes]
  //   const idx = tmp.findIndex((t) => t===null)
  //   if (idx > -1) {
  //     tmp[idx] = ''
  //     setNodTypes(tmp)
  //   }
  //
  //   form.setFieldsValue({ 'nodeTypes': tmp })
  // }

  const add = (type: NodeAttrType) => {

    let types;
    if (type == NodeAttrType.nodetype) {
      types = nodeTypes;
    } else if (type == NodeAttrType.numericalAttribute) {
      types = numericalNodeAttriutes;
    }

    const tmp = [...types]
    const idx = tmp.findIndex((t) => t===null)
    if (idx > -1) {
      tmp[idx] = ''
      if (type == NodeAttrType.nodetype) {
        setNodTypes(tmp);
      } else if (type == NodeAttrType.numericalAttribute) {
        setNumAttributes(tmp);
      }
    }

    if (type == NodeAttrType.nodetype) {
      form.setFieldsValue({ 'nodeTypes': tmp })
    } else if (type == NodeAttrType.numericalAttribute) {
      form.setFieldsValue({ 'numericalNodeAttributes': tmp })
    }
  }

  const remove = (idx: number, type: NodeAttrType) => {

    let types;
    if (type == NodeAttrType.nodetype) {
      types = nodeTypes;
    } else if (type == NodeAttrType.numericalAttribute) {
      types = numericalNodeAttriutes;
    }

    let tmp = [...types]

    // special: as the array can only have 3 items and the remove operation only happen in 2nd or 3rd item
    if (idx === 1 ) { // delete 2nd item
      tmp = [tmp[0], tmp[2], null]
    }
    else {// delete 3rd item
      tmp[idx] = null
    }

    if (type == NodeAttrType.nodetype) {
      setNodTypes(tmp);
    } else if (type == NodeAttrType.numericalAttribute) {
      setNumAttributes(tmp);
    }

    if (type == NodeAttrType.nodetype) {
      form.setFieldsValue({ 'nodeTypes': tmp })
    } else if (type == NodeAttrType.numericalAttribute) {
      form.setFieldsValue({ 'numericalNodeAttributes': tmp })
    }
  }

  const update = (value: string, idx: number, type: NodeAttrType) => {
    let types;
    if (type == NodeAttrType.nodetype) {
      types = nodeTypes;
    } else if (type == NodeAttrType.numericalAttribute) {
      types = numericalNodeAttriutes;
    }

    const tmp = [...types]
    tmp[idx] = value

    if (type == NodeAttrType.nodetype) {
      setNodTypes(tmp);
    } else if (type == NodeAttrType.numericalAttribute) {
      setNumAttributes(tmp);
    }

    if (type == NodeAttrType.nodetype) {
      form.setFieldsValue({ 'nodeTypes': tmp })
    } else if (type == NodeAttrType.numericalAttribute) {
      form.setFieldsValue({ 'numericalNodeAttributes': tmp })
    }
  }
  
  // const remove = (idx: number) => {
  //   let tmp = [...nodeTypes]
  //   // special: as the array can only have 3 items and the remove operation only happen in 2nd or 3rd item
  //   if (idx === 1 ) { // delete 2nd item
  //     tmp = [tmp[0], tmp[2], null]
  //   }
  //   else {// delete 3rd item
  //     tmp[idx] = null
  //   }
  //   setNodTypes(tmp)
  //   form.setFieldsValue({ 'nodeTypes': tmp })
  // }
  //
  // const update = (value: string, idx: number) => {
  //   const tmp = [...nodeTypes]
  //   tmp[idx] = value
  //   setNodTypes(tmp)
  //   form.setFieldsValue({ 'nodeTypes': tmp })
  // }

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
          setHasHeaderRow={setHasHeaderRow}
          setSelectionOptions={setSelectionOptions}
          selectedFileName={selectedFileName}
          setSelectedFileName={setSelectedFileName}
          form={form}
        />

        {selectedFileName.length > 0 ? <>
          <TablePreview
            columnInTable={columnInTable}
            dataInTable={dataInTable}
          />

          <Form.Item
            name="nodeID"
            style={{ marginTop: 20, marginBottom: 5 }}
            rules={[{ required: true, message: 'This is required.' }]}
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
            name="nodeLabel"
            style={{ marginBottom: 5 }}
            rules={[{ required: false }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Node Label:&nbsp;<Tooltip title="Display name for the nodes"><InfoCircleOutlined /></Tooltip></Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'nodeLabel': value })}
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
                        onChange={(value) => update(value, index, NodeAttrType.nodetype)}
                      />
                    </div>
                  </Form.Item>
                  {index !== 0 ? <Button style={{marginBottom: 5}} onClick={() => remove(index, NodeAttrType.nodetype)}>Delete this node type</Button> : null}
                </>
              )
            }
          })}

          {/*Numerical Attributes */}
          {numericalNodeAttriutes.map((attr, index) => {
            if (attr !== null) {
              return (
                <>
                  <Form.Item
                    name="numericalNodeAttributes"
                    style={{ marginBottom: 5 }}
                    rules={[{ required: false }]}
                    key={`${index}-${attr}`}
                  >
                    <div className={classes.selection}>
                      <Text className={classes.selectionName}>- Numerical Attribute {index + 1}:</Text>
                      <Select style={{ width: 300 }}
                        options={selectionOptions}
                        value={attr}
                        onChange={(value) => update(value, index, NodeAttrType.numericalAttribute)}
                      />
                    </div>
                  </Form.Item>
                  <Button style={{marginBottom: 5}} onClick={() => remove(index, NodeAttrType.numericalAttribute)}>Delete this attribute</Button>
                </>
              )
            }
          })}


          <br />
          {(nodeTypes[2]===null) ? <Button onClick={() => add(NodeAttrType.nodetype)} icon={<PlusOutlined />}>Add more node types</Button> : null}
          {<Button onClick={() => add(NodeAttrType.numericalAttribute)} icon={<PlusOutlined />}>Add numerical node attribute</Button>}
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