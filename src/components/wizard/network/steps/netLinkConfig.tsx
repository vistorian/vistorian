import { createUseStyles } from 'react-jss'
import { useState, useContext, useEffect } from 'react';
import { Button, Form, Row, Col, Select, Space, Typography, Radio, Tooltip, message } from 'antd';
import { InfoCircleOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { DataFile, IStepProps, SelectOptionType } from '../../../../../typings';
import styled from '@emotion/styled';

import { WizardContext } from '../../context'
import TimeFormat from './timeFormat';
import FileSelector from './fileSelector';
import TablePreview from './tablePreview';
import csvtojson from 'csvtojson';

const { Title, Text } = Typography;

const useStyles = createUseStyles({
  upload: {
    backgroundColor: '#eee',
    borderStyle: 'none',
    padding: '10px 20px 20px',
    borderRadius: 10,
    marginBottom: '1em',
  },
  selection: {
    display: 'flex'
  },
  selectionName: {
    width: 250,
    fontSize: 16,
  }
})

function NetLinkConfig(props: IStepProps) {
  const classes = useStyles()
  const { onPrevious, onSuccess, data, MyButton } = props;
  const { fileNameStore, setFileNameStore } = useContext(WizardContext);

  const [form] = Form.useForm()
  const directed = Form.useWatch('directed', form)
  const withTime = Form.useWatch('withTime', form)

  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [selectionOptions, setSelectionOptions] = useState<SelectOptionType[]>([])

  // for time format model 
  const [openTimeFormat, setOpenTimeFormat] = useState<boolean>(false)
  const [formatString, setFormatString] = useState<string>('%d/%m/%Y')

  const onFinish = (values: any) => {
    // console.log('link table config:', values)
    onSuccess(values, 'linkTableConfig')
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
        <MyTitle level={3}>
          Specifying your link table
        </MyTitle>

        {/* is directed link? */}
        <Form.Item
          label={<Title level={4}>1. Are links <i>directed</i>?</Title>}
          htmlFor='net-config-directed'
          name="directed"
          rules={[{ required: true, message: 'This is required.' }]}
        >
          <Radio.Group id='net-config-directed'>
            <MySpace direction="vertical">
              <Text>
                Doses it matter which node is the&nbsp;<b>source</b>, and which is the&nbsp;<b>target</b>?
              </Text>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </MySpace>
          </Radio.Group>
        </Form.Item>

        <MyTitle level={4}>
          2. Upload your table
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

        {
          selectedFileName.length > 0
            ?
            <>
              <TablePreview
                hasHeaderRow={hasHeaderRow}
                setHasHeaderRow={setHasHeaderRow}
                columnInTable={columnInTable}
                dataInTable={dataInTable}
              />

              <MyTitle level={4}>
                3. What is the structure of your link table?
              </MyTitle>
              <Text>
                From the dropdowns below, select the columns in your link table.
              </Text>

              <MyTitle level={4} style={{ fontSize: 16 }}>
                Required fields:
              </MyTitle>

              <Form.Item
                name="sourceNodeLabel"
                style={{margin: 0}}
                rules={[{ required: true, message: 'This is required.' }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Source node label:</Text>
                  <Select 
                    style={{width: 300}} 
                    options={selectionOptions}
                    onChange={(value) => {
                      if (value.length > 0)
                        form.setFieldsValue({ 'sourceNodeLabel': value })
                    }}
                  />
                </div>
              </Form.Item>
              
              <Form.Item
                name="targetNodeLabel"
                style={{ margin: 0 }}
                rules={[{ required: true, message: 'This is required.' }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Target node label:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => {
                      if (value.length > 0)
                        form.setFieldsValue({ 'targetNodeLabel': value })
                    }}
                  />
                </div>
              </Form.Item>

              <MyTitle level={4} style={{ fontSize: 16 }}>
                Optional fields:
              </MyTitle>

              <Form.Item
                name="linkId"
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Link ID:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => form.setFieldsValue({ 'linkId': value })}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="locationOfSourceNode"
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Location of source node:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => form.setFieldsValue({ 'locationOfSourceNode': value })}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="locationOfTargetNode"
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Location of target node:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => form.setFieldsValue({ 'locationOfTargetNode': value })}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="linkWeight"
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <div className={classes.selection}>
                  <Text 
                    className={classes.selectionName} 
                  >- Link weight:&nbsp;
                    <Tooltip title="A numerical measure of the strength of connection between nodes (e.g., the travel time between two locations, the value of a cash transfer.)"><InfoCircleOutlined /></Tooltip>
                  </Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => form.setFieldsValue({ 'linkWeight': value })}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="linkType"
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Link type:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => form.setFieldsValue({ 'linkType': value })}
                  />
                </div>
              </Form.Item>

              {directed ? <Form.Item
                name="whetherLinkDirected"
                style={{ margin: 0}}
                rules={[{ required: false }]}
              >
                <div className={classes.selection}>
                  <Text className={classes.selectionName}>- Whether a link is directed:</Text>
                  <Select style={{ width: 300 }}
                    options={selectionOptions}
                    onChange={(value) => form.setFieldsValue({ 'whetherLinkDirected': value })}
                  />
                </div>
              </Form.Item> : null}

              <Form.Item
                label={<Title level={4}>4. Are links associated with time?</Title>}
                htmlFor='net-config-withTime'
                name="withTime"
                rules={[{ required: true, message: 'This is required.' }]}
              >
                <Radio.Group id="net-config-withTime">
                  <MySpace direction="vertical">
                    <Text>Doses it matter which node is the&nbsp;<b>source</b>, and which is the&nbsp;<b>target</b>?</Text>
                    <Radio value={false}><b>No</b>, my links do not have associated times or this information is not recorded.</Radio>
                    <Radio value={true}><b>Yes</b>, each link is associated with a&nbsp;<i>single</i>&nbsp;time (for example, if edges correspond to letters posted from one person to another at a particular time)</Radio>
                  </MySpace>
                </Radio.Group>
              </Form.Item>

              {withTime ? <>
                <Form.Item
                  name="time"
                  style={{ margin: 0 }}
                  rules={[{ required: false }]}
                >
                  <div className={classes.selection}>
                    <Text className={classes.selectionName}>- Time:</Text>
                    <Select style={{ width: 300 }}
                      options={selectionOptions}
                      onChange={(value) => form.setFieldsValue({ 'time': value })}
                    />
                  </div>
                </Form.Item> 

                <Form.Item
                  label={<Title level={4}>5. Specify a date format:</Title>}
                  htmlFor='net-config-timeFormat'
                  name="timeFormat"
                  rules={[{ required: false, message: 'This is optional.' }]}
                >
                  <div className={classes.selection}>
                    <Text className={classes.selectionName}>{formatString}</Text>
                    <Button id='net-config-timeFormat' onClick={()=>setOpenTimeFormat(true)}>Edit</Button>
                  </div>
                </Form.Item>
                <TimeFormat 
                  open={openTimeFormat} 
                  setOpen={setOpenTimeFormat} 
                  formatString={formatString}
                  setFormatString={setFormatString}
                />
              </> : null}
            </>
            :
            null
        }

      </MySpace>

      <Form.Item>
        <Row>
          <Col span={8} style={{ display: "flex" }}>
            <MyButton type={"primary"} onClick={() => onPrevious('linkTableConfig')} icon={<LeftOutlined />}>
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

export default NetLinkConfig