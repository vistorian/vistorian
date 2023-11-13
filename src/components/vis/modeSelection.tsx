import { Button, Tooltip } from "antd"
import { Link } from "react-router-dom"
import { FileSearchOutlined, BulbOutlined, FormOutlined } from '@ant-design/icons'

interface IModeSelectionProps {
  type: string
  visTypes: string
  network: string
}

function ModeSelection(props: IModeSelectionProps) {
  // const modes: string[] = ['explore', 'xplainer', 'design']
  const modes: string[] = ['explore', 'xplainer']
  const modesNames: string[] = ['Explorer', 'Explainer']

  const icons = [<FileSearchOutlined />, <BulbOutlined />, <FormOutlined />]
  
  return (
    <div style={{ display: 'flex'}}>
      {modes.map((mode: string, index: number) => {
        if (props.type === mode) {
          return <Tooltip key={mode} title={mode}>
            <Button
              type='primary'
              icon={icons[index]}
              size="large"
            >
              {modesNames[index]}
            </Button>
          </Tooltip>
        }
        else {
          return <Tooltip key={mode} title={mode}>
            <Link
              to={`/vis/${props.visTypes}/network/${props.network}/${mode === 'explore' ? '' : mode}`}
              target='_blank'
            >
              <Button
                type='text'
                icon={icons[index]}
                size="large"
              >
                {modesNames[index]}
              </Button>
            </Link>
          </Tooltip>
        }
      })}
    </div>
  )
}

export default ModeSelection