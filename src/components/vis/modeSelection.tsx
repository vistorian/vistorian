import { Button, Tooltip } from "antd"
import { Link } from "react-router-dom"
import { FileSearchOutlined, BulbOutlined, FormOutlined } from '@ant-design/icons'

interface IModeSelectionProps {
  type: string
  visTypes: string
  network: string
}

function ModeSelection(props: IModeSelectionProps) {
  const modes: string[] = ['explore', 'xplainer', 'design']

  const icons = [<FileSearchOutlined />, <BulbOutlined />, <FormOutlined />]
  
  return (
    <div style={{ display: 'flex'}}>
      {modes.map((mode: string, index: number) => {
        if (props.type === mode) {
          return <Tooltip title={mode}>
            <Button
              type='primary'
              icon={icons[index]}
              size="large"
            >
            </Button>
          </Tooltip>
        }
        else {
          return <Tooltip title={mode}>
            <Link
              to={`/vis/${props.visTypes}/network/${props.network}/${mode === 'explore' ? '' : mode}`}
              target='_blank'
            >
              <Button
                type='text'
                icon={icons[index]}
                size="large"
              >
              </Button>
            </Link>
          </Tooltip>
        }
      })}
    </div>
  )
}

export default ModeSelection