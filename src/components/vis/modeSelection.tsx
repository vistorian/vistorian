import { Button } from "antd"
import { Link } from "react-router-dom"
import { FileSearchOutlined, BulbOutlined, FormOutlined } from '@ant-design/icons'

interface IModeSelectionProps {
  type: string
  visTypes: string
  network: string
}

function ModeSelection(props: IModeSelectionProps) {
  const modes: string[] = ['explore', 'xplainer']
  const modesNames: string[] = ['Explorer', 'Explainer']

  const icons = [<FileSearchOutlined />, <BulbOutlined />, <FormOutlined />]
  
  return (
    <div style={{ display: 'flex'}}>
      {modes.map((mode: string, index: number) => {
        if (props.type === mode) {
          return (
            <Button
              type='primary'
              icon={icons[index]}
              size="large"
              key={index}
            >
              {modesNames[index]}
            </Button>
          )}
        else {
          return (
            <Link
              to={`/vis/${props.visTypes}/network/${props.network}/${mode === 'explore' ? '' : mode}`}
              target='_blank'
              key={index}
            >
              <Button
                type='text'
                icon={icons[index]}
                size="large"
              >
                {modesNames[index]}
              </Button>
            </Link> 
        )}
      })}
    </div>
  )
}

export default ModeSelection