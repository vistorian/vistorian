import { createUseStyles } from 'react-jss'
import { useEffect, useState, useContext } from 'react';
import { Button, Form, Upload, message, Row, Col, Select, Space, Typography, Radio, Checkbox, Table, ButtonProps, Tooltip } from 'antd';
import { InfoCircleOutlined, RightOutlined, LeftOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { DataFile, IStepProps} from '../../../../../typings';
import styled from '@emotion/styled';
import { findIndex } from 'lodash-es';
import csvtojson from 'csvtojson';

import { EditorContext } from '../../context'
import TimeFormat from './timeFormat';

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

interface OptionType {
  value: string,
  label: string
}

function NetLinkConfig(props: IStepProps) {
  const classes = useStyles()
  const { onPrevious, onSuccess, data, MyButton } = props;
  const { fileNameStore, setFileNameStore } = useContext(EditorContext);

  const [form] = Form.useForm()
  const directed = Form.useWatch('directed', form)
  const withTime = Form.useWatch('withTime', form)

  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [selectionOptions, setSelectionOptions] = useState<OptionType[]>([])

  // for time format model 
  const [openTimeFormat, setOpenTimeFormat] = useState<boolean>(false)
  const [formatString, setFormatString] = useState<string>('%d/%m/%Y')

  const convertCsvToJson = async (csvData: string): Promise<any[]> => {
    const jsonArray = await csvtojson().fromString(csvData)
    return jsonArray
  }

  const onFinish = (values: any) => {
    // console.log('link table config:', values)
    onSuccess(values, 'linkTableConfig')
  }


  const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFile = (file: RcFile, fileList: RcFile[]) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onerror = () => {
      message.error(`${file.name} file upload failed.`)
    }
    reader.onload = () => {
      if (findIndex(fileNameStore, (fn: DataFile) => fn.name === file.name) > -1) {
        message.error(`${file.name} file upload failed, as the system does not allow data files uploaded with the same name. You select a previously uploaded file.`)
        return false
      }
      message.success(`${file.name} file uploaded successfully.`)
      // console.log('reader.onload:', reader.result)
      window.localStorage.setItem("UPLOADED_FILE_" + file.name, reader.result as string)
      const tmp: DataFile = {
        name: file.name,
        hasHeader: true
      }
      setFileNameStore([...fileNameStore, tmp])
      setSelectedFileName(file.name)
    }
    return false
  }

  const getSelectionFileList = () => {
    return fileNameStore.map((fn: DataFile) => {
      return {
        label: fn.name,
        value: fn.name
      }
    })
  }

  useEffect(()=>{
    if (selectedFileName.length > 0) {
      const csvdata = window.localStorage.getItem("UPLOADED_FILE_" + selectedFileName)
      if (csvdata) {
        // TODO: deal with no fakeHeader
        convertCsvToJson(csvdata)
          .then((jsonData) => {
            const headers = Object.keys(jsonData[0])
            const columns = headers.map(header => {
              return {
                title: header,
                dataIndex: header,
                key: header,
              }
            })
            let options = [{value: '', label: '-'}]
            headers.map((header: string) => {
              options.push({
                value: header,
                // @ts-ignore
                label: `${header} (First value is ${jsonData[0][header]})`,
              })
            })
            setColumnInTable(columns)
            // only preview 5 rows
            const dataintable = jsonData.slice(0, 5).map((d, i) => {
              d._rowKey = i
              return d
            })
            setDataInTable(dataintable)
            setSelectionOptions(options)
          })
          .catch((error) => {
            message.error('Error during CSV to JSON conversion:');
          })
      }
      else {
        message.error('There is no such data file in the storage!')
      } 
    }    
  }, [selectedFileName, hasHeaderRow])

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
          name="directed"
          rules={[{ required: true, message: 'This is required.' }]}
        >
          <Radio.Group>
            <MySpace direction="vertical">
              <Text>
                Doses it matter which node is the&nbsp;<b>source</b>, and which is the&nbsp;<b>target</b>?
              </Text>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </MySpace>
          </Radio.Group>
        </Form.Item>
        
        {/* select data files */}
        <Form.Item
            label={<Title level={4}>2. Upload your table</Title>}
            name="file"
            rules={[{ required: true, message: 'This is required.' }]}
          >
          <div className={classes.upload}>
            {/* Dragger needs two form.item! */}
              <Form.Item style={{marginBottom: 0}}>
                <div style={{ display: 'flex' }}>
                  <Text style={{width: 300, fontSize: 16, paddingTop: 4}}>Select a previously uploaded file</Text>
                <Select 
                  style={{ width: 300 }} 
                  options={getSelectionFileList()} 
                  onChange={(value) => {
                    setSelectedFileName(value)
                    form.setFieldsValue({ 'file': value })
                  }}
                />
                </div>
              </Form.Item>
              <Text style={{ fontSize: 16}}>Or</Text>
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger
                  beforeUpload={handleFile}
                  showUploadList={false}
                  accept="text/csv"
                >
                  <p className="ant-upload-text">Click or drag files to this area to upload.</p>
                  <p className="ant-upload-hint">
                    Support for CSV files.
                  </p>
                </Upload.Dragger>
              </Form.Item>
          </div>
        </Form.Item>

        {
          selectedFileName.length > 0
            ?
            <>
              <Form.Item name="hasHeaderRow" valuePropName="checked">
                <Checkbox 
                  checked 
                  onChange={() => setHasHeaderRow(!hasHeaderRow)}
                >
                  Has header row?
                </Checkbox>
              </Form.Item>
              <Table 
                columns={columnInTable} 
                dataSource={dataInTable} 
                pagination={false}
                rowKey={(record)=>record._rowKey}
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
                      if (value !== '')
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
                      if (value !== '')
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
                name="withTime"
                rules={[{ required: true, message: 'This is required.' }]}
              >
                <Radio.Group>
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
                  name="timeFormat"
                  rules={[{ required: false, message: 'This is optional.' }]}
                >
                  <div className={classes.selection}>
                    <Text className={classes.selectionName}>{formatString}</Text>
                    <Button onClick={()=>setOpenTimeFormat(true)}>Edit</Button>
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