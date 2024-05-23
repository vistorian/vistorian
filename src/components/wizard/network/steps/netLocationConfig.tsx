import { createUseStyles } from 'react-jss'
import { useEffect, useState } from 'react';
import { Typography, Form, Select, Row, Col, Space, Radio} from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { StepData, IStepProps, SelectOptionType } from '../../../../../typings'
import styled from '@emotion/styled';
import FileSelector from './fileSelector';
import TablePreview from './tablePreview';

const { Title, Text } = Typography;

const useStyles = createUseStyles({
  selection: {
    display: 'flex'
  },
  selectionName: {
    width: 250,
    fontSize: 16,
  }
})


function NetLocationConfig(props: IStepProps) {
  const classes = useStyles()
  const { onSuccess, onPrevious, data, MyButton } = props;
  
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [selectionOptions, setSelectionOptions] = useState<SelectOptionType[]>([])

  const [form] = Form.useForm();
  const hasLocationFile = Form.useWatch('hasLocationFile', form)

  useEffect(() => {
    form.setFieldsValue({ ...data.locationTableConfig });
  }, []);

  const onFinish = (values: StepData) => {
    // console.log('locationTableConfig', values)
    onSuccess(values, 'locationTableConfig');
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
      <Title level={3}>Specifying your location table:</Title>

      <Form.Item
        label={<Title level={4}>Do you have a file giving the lat/long of each location?</Title>}
        htmlFor="net-config-hasLocationFile"
        name="hasLocationFile"
        rules={[{ required: true, message: 'This is required.' }]}
      >
        <Radio.Group id="net-config-hasLocationFile">
          <MySpace direction="vertical">
            <Radio value={false}><b>No</b>, I do not have a file specifying the longitude and latitude of place names. I want the Vistorian to get these for me, please.</Radio>
            <Radio value={true}><b>Yes</b>, I have a file specifying the longitude and latitude of each place name used in the node-link table.</Radio>
          </MySpace>
        </Radio.Group>
      </Form.Item>

      {hasLocationFile ? <>
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
            // hasHeaderRow={hasHeaderRow} 
            // setHasHeaderRow={setHasHeaderRow} 
            columnInTable={columnInTable}
            dataInTable={dataInTable}
          />

          <Form.Item
            name="place"
            style={{ marginTop: 20, marginBottom: 5 }}
            rules={[{ required: false }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Place name:</Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'place': value })}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="lat"
            style={{ marginBottom: 5 }}
            rules={[{ required: false }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Latitude:</Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'lat': value })}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="lon"
            style={{ marginBottom: 5 }}
            rules={[{ required: false }]}
          >
            <div className={classes.selection}>
              <Text className={classes.selectionName}>- Longitude:</Text>
              <Select style={{ width: 300 }}
                options={selectionOptions}
                onChange={(value) => form.setFieldsValue({ 'lon': value })}
              />
            </div>
          </Form.Item>
        </> : null}
      
      </> : null}

      <Form.Item>
        <Row>
          <Col span={8} style={{ display: "flex" }}>
            <MyButton type={"primary"} onClick={() => onPrevious('locationTableConfig')} icon={<LeftOutlined />}>
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


export default NetLocationConfig