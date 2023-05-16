import { createUseStyles } from 'react-jss'
import { useEffect, useState, useContext } from 'react';
import { Button, Form, Upload, message, Row, Col, Select, Space, Typography, Radio, Checkbox, Table, Input, ButtonProps } from 'antd';
import { InboxOutlined, RightOutlined, LeftOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { DataFile, Step4SpecifyDataType, StepFormDataType } from '../../../../../typings';
import styled from '@emotion/styled';
import { findIndex, cloneDeep } from 'lodash-es';

import { EditorContext } from '../../context'

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

interface IStep4SpecifyProps {
  data: StepFormDataType;
  onSuccess: (data: Step4SpecifyDataType, step: number) => void;
  onPrevious: (step: number) => void;
  // updateDataTableInfo: (dataInTable: any[], hasHeaderRow: boolean, columnInTable: any[]) => void;
  MyButton: React.FunctionComponent<ButtonProps>;
}

const useStyles = createUseStyles({
  upload: {
    backgroundColor: '#eee',
    borderStyle: 'none',
    padding: '10px 20px 20px',
    borderRadius: 10,
    marginBottom: '1em',
  }
})

function Step4Specify(props: IStep4SpecifyProps) {
  const classes = useStyles()
  const { onPrevious, onSuccess, data, MyButton } = props;
  const { fileNameStore, setFileNameStore } = useContext(EditorContext);

  const [form] = Form.useForm()

  const [uploaded, setUploaded] = useState<boolean>(false)
  const [dataInTable, setDataInTable] = useState<any[]>([]);
  const [columnInTable, setColumnInTable] = useState<any[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true)
  const [requiredSelectOption, setRequiredSelectOption] = useState<any>(null);
  const [unRequiredSelectOption, setUnRequiredSelectOption] = useState<any>(null);

  const onFinish = (values: Step4SpecifyDataType) => {}


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
      setUploaded(true)
      const re = csvToJson(reader.result as string)
      setColumnInTable(re.columns)
      setDataInTable(re.data)
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

  const csvToJson = (data: string) => {
    let lines = data.split("\n");
    let result = new Array<object>()

    // Extract the header line
    const headers = lines[0].split(",");

    const columns = headers.map(header => {
      return {
        title: header,
        dataIndex: header,
        key: header,
      }
    })
    // data preview with 5 rows
    lines.map((line, i) => {
      if (i > 0 && i <= 5) {
        let obj = {}
        let currentLine = line.split(",")
        for (let j = 0; j < headers.length; j++) {
          // @ts-ignore
          obj[headers[j]] = currentLine[j];
        }
        result.push(obj);
      }
    })
    return {
      columns: columns,
      data: result
    }
  }

  const selectedFile = (value: string) => {
    setUploaded(true)
    const re = csvToJson(value)
    setColumnInTable(re.columns)
    setDataInTable(re.data)
  }

  useEffect(() => {
    // console.log("4: ", data)
    if (!data.step4Specify) return
    form.setFieldsValue({ ...data.step4Specify })
    if (data.step4Specify.file) {
      setUploaded(true)
      setHasHeaderRow(data.step4Specify.hasHeaderRow)
      // setCsvData(data.step4Specify.fileData)
    }
  }, [])

  return (
    <div>
      {data.step3Link?.link === "rowPerLink" ?
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
                  <Radio value={"true"}>Yes</Radio>
                  <Radio value={"false"}>No</Radio>
                </MySpace>
              </Radio.Group>
            </Form.Item>

            <Form.Item
                label={<Title level={4}>2. Upload your table</Title>}
                name="directed"
                rules={[{ required: true, message: 'This is required.' }]}
              >
              <div className={classes.upload}>
                {/* Dragger needs two form.item! */}
                  <Form.Item style={{marginBottom: 0}}>
                    <div style={{ display: 'flex' }}>
                      <Text style={{width: 300, fontSize: 16, paddingTop: 4}}>Select a previously uploaded file</Text>
                      <Select style={{ width: 300 }} options={getSelectionFileList()} onChange={selectedFile} />
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
                      name="file"
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
              uploaded
                ?
                <>
                  <Form.Item name="hasHeaderRow" valuePropName="checked">
                    <Checkbox checked onChange={() => setHasHeaderRow(!hasHeaderRow)}>
                      Has header row?
                    </Checkbox>
                  </Form.Item>
                  <Table 
                    columns={columnInTable} 
                    showHeader={hasHeaderRow} 
                    dataSource={dataInTable} 
                    pagination={false}>
                  </Table>

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
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Source node label</MyTitle>}
                    rules={[{ required: true, message: 'This is required.' }]}
                  >
                    <Select>
                      {/* {columnInTable.map((column, i) => {
                          return <Option key={column.key} value={column.dataIndex}>{`${column.title} (first value is "${firstRow ? firstRow[column.dataIndex] : null}")`}</Option>
                        })} */}
                      {requiredSelectOption}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="targetNodeLabel"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Target node label</MyTitle>}
                    rules={[{ required: true, message: 'This is required.' }]}
                  >
                    <Select>
                      {requiredSelectOption}
                    </Select>
                  </Form.Item>

                  <MyTitle level={4} style={{ fontSize: 16 }}>
                    Optional fields:
                  </MyTitle>

                  <Form.Item
                    name="linkId"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Link id</MyTitle>}
                    rules={[{ required: false }]}
                  >
                    <Select>
                      {unRequiredSelectOption}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="locationOfSourceNode"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Location of source node</MyTitle>}
                    rules={[{ required: false }]}
                  >
                    <Select>
                      {unRequiredSelectOption}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="locationOfTargetNode"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Location of target node</MyTitle>}
                    rules={[{ required: false }]}
                  >
                    <Select>
                      {unRequiredSelectOption}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="linkWeight"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Link weight</MyTitle>}
                    rules={[{ required: false }]}
                    tooltip={"A numerical measure of the strength of connection between nodes (e.g., the travel time between two locations, the value of a cash transfer.)"}
                  >
                    <Select>
                      {unRequiredSelectOption}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="linkType"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Link type</MyTitle>}
                    rules={[{ required: false }]}
                  >
                    <Select>
                      {unRequiredSelectOption}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="whetherLinkDirected"
                    label={<MyTitle level={4} style={{ fontSize: 14, marginTop: 4 }}>- Whether a link is directed</MyTitle>}
                    rules={[{ required: false }]}
                  >
                    <Select>
                      {unRequiredSelectOption}
                    </Select>
                  </Form.Item>

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
                </>
                :
                null
            }

          </MySpace>

          <Form.Item>
            <Row>
              <Col span={8} style={{ display: "flex" }}>
                <MyButton type={"primary"} onClick={() => onPrevious(4)} icon={<LeftOutlined />}>
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
        </Form> : 
        <Form>
          
        </Form>
      }

      {/* <Button onClick={handleOpen}>upload file (only frontend)</Button> */}
    </div>
  )
}

const MySpace = styled(Space)({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  textAlign: "left"
})

const MyParagraph = styled(Paragraph)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  textAlign: "left"
})

const MyTitle = styled(Title)({
  marginTop: 20,
  marginBottom: 20
})

export default Step4Specify